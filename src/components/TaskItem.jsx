import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext.jsx";

export default function TaskItem({ task }) {
  const { dispatch } = useTasks();

  return (
    <li className={`task ${task.done ? "is-done" : ""}`}>
      <input
        type="checkbox"
        id={`chk-${task.id}`}
        checked={task.done}
        onChange={() => dispatch({ type: "toggle", id: task.id })}
      />
      <label htmlFor={`chk-${task.id}`} className="task-title">{task.title}</label>
      <span className={`pill pill-${task.priority}`}>{task.priority}</span>
      <Link className="task-open" to={`/tasks/${task.id}`} aria-label={`Open details for ${task.title}`}>
        Details
      </Link>
    </li>
  );
}
