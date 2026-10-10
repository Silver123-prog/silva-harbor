import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="auth-card panel">
        <h1>Check your email</h1>
        <p className="auth-sub">
          If an account exists for <strong>{email}</strong>, a link to reset your password is on its way.
        </p>
        <Link to="/login">Back to log in</Link>
      </div>
    );
  }

  return (
    <div className="auth-card panel">
      <h1>Reset your password</h1>
      <p className="auth-sub">Enter your email and we'll send you a reset link.</p>
      <form className="stack" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="text" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Sending" : "Send reset link"}</button>
      </form>
      <p className="auth-switch"><Link to="/login">Back to log in</Link></p>
    </div>
  );
}
