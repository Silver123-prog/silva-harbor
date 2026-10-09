import { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";

export default function TaskForm({ compact = false }) {
  const { dispatch } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Enter a task name to add it.");
      return;
    }
    dispatch({ type: "add", title: title.trim(), priority });
    setTitle("");
    setError("");
  }

  return (
    <form className={`task-form ${compact ? "is-compact" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className="field grow">
        <label htmlFor="new-task" className="sr-only">Task name</label>
        <input
          id="new-task"
          type="text"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "new-task-error" : undefined}
        />
      </div>
      <div className="field">
        <label htmlFor="new-priority" className="sr-only">Priority</label>
        <select id="new-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button className="btn btn-primary" type="submit">Add task</button>
      {error && <p id="new-task-error" className="error" role="alert">{error}</p>}
    </form>
  );
}
