import { NavLink, Outlet, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";

export default function Layout() {
  const { theme, toggle } = useTheme();

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
              <li><NavLink to="/" end>Today</NavLink></li>
              <li><NavLink to="/tasks">Tasks</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
            </ul>
          </nav>
          <button
            className="btn btn-ghost"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>
      <main id="main" className="container">
        <Outlet />
      </main>
      <footer className="container site-footer">
        <p>Built by Michael Adebayo</p>
      </footer>
    </>
  );
}
