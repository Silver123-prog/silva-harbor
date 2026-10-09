import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import WeekChart from "../components/WeekChart.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

const order = { high: 0, medium: 1, low: 2 };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];
  const open = tasks.filter((t) => !t.done).sort((a, b) => order[a.priority] - order[b.priority]);
  const doneCount = tasks.length - open.length;
  const progress = tasks.length ? doneCount / tasks.length : 0;

  return (
    <>
      <section className="hero">
        <div>
          <h1>{greeting()}, {firstName}.</h1>
          <p className="lead">
            {tasks.length === 0
              ? "Your plan is empty. Add your first task below."
              : open.length === 0
              ? "Everything is done. Add something new or enjoy the quiet."
              : `You have ${open.length} open ${open.length === 1 ? "task" : "tasks"}. Start with the first one below.`}
          </p>
        </div>
        <ProgressRing value={progress} />
      </section>

      <section aria-labelledby="quick-add" className="panel">
        <h2 id="quick-add">Quick add</h2>
        <TaskForm compact />
      </section>

      <div className="grid-2">
        <section aria-labelledby="up-next" className="panel">
          <div className="panel-head">
            <h2 id="up-next">Up next</h2>
            <Link to="/tasks">See all tasks</Link>
          </div>
          {open.length === 0 ? (
            <p className="empty">Nothing waiting. Add a task above to get started.</p>
          ) : (
            <ul className="task-list">
              {open.slice(0, 4).map((t) => <TaskItem key={t.id} task={t} />)}
            </ul>
          )}
        </section>

        <section aria-labelledby="this-week" className="panel">
          <h2 id="this-week">This week</h2>
          <WeekChart tasks={tasks} />
        </section>
      </div>
    </>
  );
}
