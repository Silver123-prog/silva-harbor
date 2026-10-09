import { createContext, useContext, useEffect, useReducer } from "react";

const TaskContext = createContext(null);
const STORAGE_KEY = "Silva Harbor-tasks";

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

// Demo data so the dashboard looks alive on first visit.
const seed = [
  { id: "s1", title: "Plan the week", notes: "Pick three things that matter most.", priority: "high", due: "", done: true, createdAt: daysAgo(3), completedAt: daysAgo(2) },
  { id: "s2", title: "Reply to design feedback", notes: "", priority: "medium", due: "", done: true, createdAt: daysAgo(3), completedAt: daysAgo(1) },
  { id: "s3", title: "Book dentist appointment", notes: "", priority: "low", due: "", done: true, createdAt: daysAgo(2), completedAt: daysAgo(1) },
  { id: "s4", title: "Finish portfolio case study", notes: "Add the before/after screenshots and a short summary.", priority: "high", due: "", done: false, createdAt: daysAgo(1), completedAt: null },
  { id: "s5", title: "Read two chapters", notes: "", priority: "low", due: "", done: false, createdAt: daysAgo(1), completedAt: null },
  { id: "s6", title: "Groceries", notes: "Rice, tomatoes, fish, plantain.", priority: "medium", due: "", done: false, createdAt: daysAgo(0), completedAt: null },
];

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seed;
  } catch {
    return seed;
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

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  return <TaskContext.Provider value={{ tasks, dispatch }}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside <TaskProvider>");
  return ctx;
}
