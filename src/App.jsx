import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import TaskDetail from "./pages/TaskDetail.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public pages */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="about" element={<About />} />

        {/* Private pages: need an account */}
        <Route element={<RequireAuth />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
