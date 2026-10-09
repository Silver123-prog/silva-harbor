import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { user, signUp, signIn, demo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignup) await signUp(form);
      else await signIn(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card panel">
      <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
      <p className="auth-sub">
        {isSignup ? "Your tasks stay private to your account." : "Log in to see your plans."}
      </p>

      <form className="stack" onSubmit={submit} noValidate>
        {isSignup && (
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={change} />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="text" inputMode="email" autoComplete="email" value={form.email} onChange={change} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={form.password}
            onChange={change}
            aria-describedby={isSignup ? "pw-hint" : undefined}
          />
          {isSignup && <span id="pw-hint" className="hint">At least 8 characters.</span>}
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Please wait" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="auth-switch">
        {isSignup ? (
          <>Already have an account? <Link to="/login">Log in</Link></>
        ) : (
          <>New here? <Link to="/signup">Create an account</Link></>
        )}
      </p>

      {!isSignup && (
        <div className="demo">
          <p>Just looking around?</p>
          <button className="btn btn-ghost" type="button" onClick={() => { demo(); navigate("/", { replace: true }); }}>
            Try the demo
          </button>
        </div>
      )}
    </div>
  );
}
