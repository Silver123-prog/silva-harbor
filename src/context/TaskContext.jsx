import { createContext, useContext, useEffect, useReducer } from "react";

import { tasksKey } from "../data/seed.js";

const TaskContext = createContext(null);

function load(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [
        {
          id: crypto.randomUUID(),
          title: action.title,
          notes: action.notes ?? "",
          priority: action.priority ?? "medium",
          due: action.due ?? "",
          done: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
        ...state,
      ];
    case "toggle":
      return state.map((t) =>
        t.id === action.id
          ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null }
          : t
      );
    case "update":
      return state.map((t) => (t.id === action.id ? { ...t, ...action.changes } : t));
    case "remove":
      return state.filter((t) => t.id !== action.id);
    case "clearDone":
      return state.filter((t) => !t.done);
    default:
      return state;
  }
}

export function TaskProvider({ userId, children }) {
  const key = tasksKey(userId);
  const [tasks, dispatch] = useReducer(reducer, key, load);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(tasks));
  }, [key, tasks]);

  return <TaskContext.Provider value={{ tasks, dispatch }}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside <TaskProvider>");
  return ctx;
}
