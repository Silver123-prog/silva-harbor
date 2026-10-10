import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PasswordField from "../components/PasswordField.jsx";

// Opened from the link in the reset email. The link signs the person in temporarily.
export default function ResetPassword() {
  const { user, ready, resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!ready) return <p className="empty" role="status">Loading…</p>;

  if (!user || user.isDemo) {
    return (
      <div className="auth-card panel">
        <h1>Link expired</h1>
        <p className="auth-sub">This reset link is invalid or has expired.</p>
        <Link className="btn btn-primary" to="/forgot-password">Get a new link</Link>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await resetPassword(password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="auth-card panel">
        <h1>Password updated</h1>
        <p className="auth-sub">You're signed in with your new password.</p>
        <Link className="btn btn-primary" to="/">Go to my plans</Link>
      </div>
    );
  }

  return (
    <div className="auth-card panel">
      <h1>Choose a new password</h1>
      <form className="stack" onSubmit={submit} noValidate>
        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          hint="At least 8 characters."
        />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving" : "Save password"}</button>
      </form>
    </div>
  );
}
