import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordField from "./PasswordField.jsx";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { user, ready, hasBackend, signUp, signIn, demo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);

  if (!ready) return <p className="empty" role="status">Loading…</p>;
  if (user) return <Navigate to="/" replace />;

  if (confirmEmail) {
    return (
      <div className="auth-card panel">
        <h1>Check your email</h1>
        <p className="auth-sub">
          We sent a confirmation link to <strong>{form.email}</strong>. Open it, then come back and log in.
        </p>
        <Link className="btn btn-primary" to="/login">Go to log in</Link>
      </div>
    );
  }

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignup) {
        const { needsConfirmation } = await signUp(form);
        if (needsConfirmation) setConfirmEmail(true);
        else navigate(from, { replace: true });
      } else {
        await signIn(form);
        navigate(from, { replace: true });
      }
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
        {isSignup ? "Your plans are private and available on any device." : "Log in to see your plans."}
      </p>

      {/* Developer note: only visible while running locally, never on the live site */}
      {!hasBackend && import.meta.env.DEV && (
        <p className="notice">Dev note: Supabase keys not found. Check .env.local and restart the dev server.</p>
      )}

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
        <PasswordField
          value={form.password}
          onChange={change}
          autoComplete={isSignup ? "new-password" : "current-password"}
          hint={isSignup ? "At least 8 characters." : undefined}
        />
        {!isSignup && <Link className="forgot" to="/forgot-password">Forgot password?</Link>}

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
