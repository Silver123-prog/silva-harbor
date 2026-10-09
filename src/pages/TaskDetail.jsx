import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext.jsx";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, dispatch } = useTasks();
  const task = tasks.find((t) => t.id === id);

  const [form, setForm] = useState({ title: "", notes: "", priority: "medium", due: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (task) setForm({ title: task.title, notes: task.notes, priority: task.priority, due: task.due });
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!task) {
    return (
      <div className="panel">
        <h1>Task not found</h1>
        <p>It may have been deleted. <Link to="/tasks">Back to tasks</Link></p>
      </div>
    );
  }

  const change = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function save(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    dispatch({ type: "update", id, changes: { ...form, title: form.title.trim() } });
    setSaved(true);
  }

  function remove() {
    if (window.confirm(`Delete "${task.title}"?`)) {
      dispatch({ type: "remove", id });
      navigate("/tasks");
    }
  }

  return (
    <>
      <p><Link to="/tasks">← Back to tasks</Link></p>
      <h1>Edit task</h1>
      <form className="panel stack" onSubmit={save}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={change} required />
        </div>
        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows="4" value={form.notes} onChange={change} />
        </div>
        <div className="row">
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={change}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="due">Due date</label>
            <input id="due" name="due" type="date" value={form.due} onChange={change} />
          </div>
        </div>
        <div className="row">
          <button className="btn btn-primary" type="submit">Save changes</button>
          <button className="btn btn-danger" type="button" onClick={remove}>Delete task</button>
          <span className="saved" role="status">{saved ? "Saved" : ""}</span>
        </div>
      </form>
    </>
  );
}
