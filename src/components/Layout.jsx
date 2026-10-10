import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Leaving demo mode clears it, then opens the chosen page.
  const leaveDemo = async (to) => {
    await signOut();
    navigate(to);
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Silva Harbor home">
            <span aria-hidden="true">⚓</span> Silva Harbor
          </Link>
          <nav aria-label="Main">
            <ul className="nav-list">
              {user && <li><NavLink to="/" end>Today</NavLink></li>}
              {user && <li><NavLink to="/tasks">Tasks</NavLink></li>}
              <li><NavLink to="/about">About</NavLink></li>
            </ul>
          </nav>
          <div className="header-actions">
            <button
              className="btn btn-ghost"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {user?.isDemo ? (
              <>
                <span className="nav-user">Demo mode</span>
                <button className="btn btn-ghost" onClick={() => leaveDemo("/login")}>Log in</button>
                <button className="btn btn-primary" onClick={() => leaveDemo("/signup")}>Sign up</button>
              </>
            ) : user ? (
              <>
                <span className="nav-user">{user.name}</span>
                <button className="btn btn-ghost" onClick={signOut}>Log out</button>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost" to="/login">Log in</Link>
                <Link className="btn btn-primary" to="/signup">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main id="main" className="container">
        <Outlet />
      </main>
      <footer className="container site-footer">
        <p>Your plans are private to your account.</p>
      </footer>
    </>
  );
}
