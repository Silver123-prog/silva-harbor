import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { demoTasks, tasksKey } from "../data/seed.js";

const TaskContext = createContext(null);

// The app uses camelCase; the database uses snake_case.
const fromRow = (r) => ({
  id: r.id, title: r.title, notes: r.notes, priority: r.priority, due: r.due,
  done: r.done, createdAt: r.created_at, completedAt: r.completed_at,
});
const toRow = (t) => ({
  id: t.id, title: t.title, notes: t.notes, priority: t.priority, due: t.due,
  done: t.done, created_at: t.createdAt, completed_at: t.completedAt,
});
const changesToRow = (c) => {
  const map = { title: "title", notes: "notes", priority: "priority", due: "due", done: "done", completedAt: "completed_at" };
  return Object.fromEntries(Object.entries(c).filter(([k]) => map[k]).map(([k, v]) => [map[k], v]));
};

function reducer(state, action) {
  switch (action.type) {
    case "load": return action.tasks;
    case "add": return [action.task, ...state];
    case "update": return state.map((t) => (t.id === action.id ? { ...t, ...action.changes } : t));
    case "remove": return state.filter((t) => t.id !== action.id);
    case "clearDone": return state.filter((t) => !t.done);
    default: return state;
  }
}

export function TaskProvider({ user, children }) {
  const isDemo = !!user.isDemo;
  const key = tasksKey(user.id);
  const [tasks, rawDispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState("");
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  // Load: demo tasks come from this browser, real accounts from the database.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (isDemo) {
        let saved = null;
        try { saved = JSON.parse(localStorage.getItem(key)); } catch { /* ignore */ }
        rawDispatch({ type: "load", tasks: saved ?? demoTasks });
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) console.error("[Harbor load]", error);
      if (error) setSyncError("Couldn't load your plans. Check your connection and refresh.");
      else rawDispatch({ type: "load", tasks: data.map(fromRow) });
      setLoading(false);
    }
    run();
    return () => { cancelled = true; };
  }, [isDemo, key]);

  // Demo mode saves to localStorage.
  useEffect(() => {
    if (isDemo && !loading) localStorage.setItem(key, JSON.stringify(tasks));
  }, [isDemo, key, tasks, loading]);

  const save = useCallback(async (request) => {
    const { error } = await request;
    if (error) console.error("[Harbor save]", error);
    setSyncError(error ? "Your last change couldn't be saved. Check your connection and try again." : "");
  }, []);

  // Same dispatch API as before: the screen updates instantly, the database follows.
  const dispatch = useCallback((action) => {
    const cloud = !isDemo;
    switch (action.type) {
      case "add": {
        const task = {
          id: crypto.randomUUID(),
          title: action.title,
          notes: action.notes ?? "",
          priority: action.priority ?? "medium",
          due: action.due ?? "",
          done: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        rawDispatch({ type: "add", task });
        if (cloud) save(supabase.from("tasks").insert(toRow(task)));
        break;
      }
      case "toggle": {
        const current = tasksRef.current.find((t) => t.id === action.id);
        if (!current) break;
        const changes = { done: !current.done, completedAt: !current.done ? new Date().toISOString() : null };
        rawDispatch({ type: "update", id: action.id, changes });
        if (cloud) save(supabase.from("tasks").update(changesToRow(changes)).eq("id", action.id));
        break;
      }
      case "update":
        rawDispatch(action);
        if (cloud) save(supabase.from("tasks").update(changesToRow(action.changes)).eq("id", action.id));
        break;
      case "remove":
        rawDispatch(action);
        if (cloud) save(supabase.from("tasks").delete().eq("id", action.id));
        break;
      case "clearDone":
        rawDispatch(action);
        if (cloud) save(supabase.from("tasks").delete().eq("done", true));
        break;
      default:
        break;
    }
  }, [isDemo, save]);

  if (loading) return <p className="empty" role="status">Loading your plans…</p>;

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {syncError && <p className="error banner" role="alert">{syncError}</p>}
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside <TaskProvider>");
  return ctx;
}
