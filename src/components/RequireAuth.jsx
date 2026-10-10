import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { TaskProvider } from "../context/TaskContext.jsx";

// Guards private pages and loads the signed-in person's own tasks.
export default function RequireAuth() {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <p className="empty" role="status">Loading…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <TaskProvider key={user.id} user={user}>
      <Outlet />
    </TaskProvider>
  );
}
