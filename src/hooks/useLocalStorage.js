import { useEffect, useState } from "react";

// Same API as useState, but the value survives page refreshes.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: app still works in memory */
    }
  }, [key, value]);

  return [value, setValue];
}
