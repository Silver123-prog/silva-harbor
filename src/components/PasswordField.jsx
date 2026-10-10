import { useState } from "react";

// Password input with a Show / Hide button (controlled with useState).
export default function PasswordField({ id = "password", name = "password", label = "Password", value, onChange, autoComplete, hint }) {
  const [show, setShow] = useState(false);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="pw-wrap">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <button
          type="button"
          className="pw-toggle"
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {hint && <span id={`${id}-hint`} className="hint">{hint}</span>}
    </div>
  );
}
