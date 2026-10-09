import { useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

const FILTERS = ["all", "open", "done"];

export default function Tasks() {
  const { tasks, dispatch } = useTasks();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter === "open" && t.done) return false;
      if (filter === "done" && !t.done) return false;
      return !q || t.title.toLowerCase().includes(q);
    });
  }, [tasks, filter, query]);

  const hasDone = tasks.some((t) => t.done);

  return (
    <>
      <h1>Tasks</h1>
      <section className="panel" aria-label="Add a task">
        <TaskForm />
      </section>

      <section className="panel" aria-label="Task list">
        <div className="toolbar">
          <div role="group" aria-label="Filter tasks" className="segmented">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={filter === f ? "is-active" : ""}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="field grow">
            <label htmlFor="search" className="sr-only">Search tasks</label>
            <input id="search" type="search" placeholder="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {hasDone && (
            <button className="btn btn-ghost" onClick={() => dispatch({ type: "clearDone" })}>
              Clear completed
            </button>
          )}
        </div>

        <p className="count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "task" : "tasks"} shown
        </p>

        {visible.length === 0 ? (
          <p className="empty">
            {tasks.length === 0 ? "No tasks yet. Add your first one above." : "No tasks match this filter."}
          </p>
        ) : (
          <ul className="task-list">
            {visible.map((t) => <TaskItem key={t.id} task={t} />)}
          </ul>
        )}
      </section>
    </>
  );
}
