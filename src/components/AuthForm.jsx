import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordField from "./PasswordField.jsx";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { user, ready, hasBackend, signUp, signIn, signInWithGoogle, demo } = useAuth();
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

  async function google() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle(); // the browser leaves for Google, so nothing else to do on success
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
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

      <button type="button" className="google-btn" onClick={google} disabled={busy}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        Continue with Google
      </button>
      <div className="or"><span>or use email</span></div>

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
