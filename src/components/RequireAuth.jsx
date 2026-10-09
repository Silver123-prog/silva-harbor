import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { TaskProvider } from "../context/TaskContext.jsx";

// Guards private pages and gives each signed-in user their own task list.
export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <TaskProvider key={user.id} userId={user.id}>
      <Outlet />
    </TaskProvider>
  );
}
