import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);
const DEMO_KEY = "harbor-demo";
const GENERIC = "Something went wrong on our side. Please try again in a moment.";

// Visitors see a friendly message. The real error is logged to the console for the developer.
function friendly(error) {
  console.error("[Harbor auth]", error);
  const msg = error?.message || "";
  if (/rate limit|too many/i.test(msg)) return "Too many attempts. Please wait a few minutes and try again.";
  if (/already registered|already exists/i.test(msg)) return "An account with this email already exists. Log in instead.";
  if (/different from the old/i.test(msg)) return "Choose a password you haven't used before.";
  return GENERIC;
}

function notConnected() {
  console.error("[Harbor] Supabase keys are missing. Check .env.local (local) or Environment Variables (Vercel), then restart/redeploy.");
  return new Error(GENERIC);
}

const shape = (u) =>
  u ? { id: u.id, email: u.email, name: u.user_metadata?.name || u.email?.split("@")[0] || "Friend" } : null;

const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [demoOn, setDemoOn] = useState(() => localStorage.getItem(DEMO_KEY) === "1");
  const [ready, setReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setAccount(shape(data.session?.user));
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setAccount(shape(session?.user)));
    return () => data.subscription.unsubscribe();
  }, []);

  const user = account ?? (demoOn ? { id: "demo", name: "Demo", email: "", isDemo: true } : null);

  async function signUp({ name, email, password }) {
    if (!supabase) throw notConnected();
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) throw new Error("Enter your name.");
    if (!validEmail(cleanEmail)) throw new Error("Enter a valid email address.");
    if (password.length < 8) throw new Error("Use a password with at least 8 characters.");

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name: name.trim() }, emailRedirectTo: window.location.origin },
    });
    if (error) throw new Error(friendly(error));
    // When email confirmation is switched on, there is no session until the link is clicked.
    return { needsConfirmation: !data.session };
  }

  async function signIn({ email, password }) {
    if (!supabase) throw notConnected();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) {
      if (/confirm/i.test(error.message)) throw new Error("Please confirm your email first. Check your inbox.");
      throw new Error("Email or password is incorrect.");
    }
  }

  async function forgotPassword(email) {
    if (!supabase) throw notConnected();
    const cleanEmail = email.trim().toLowerCase();
    if (!validEmail(cleanEmail)) throw new Error("Enter a valid email address.");
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(friendly(error));
  }

  async function resetPassword(password) {
    if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(friendly(error));
  }

  function demo() {
    localStorage.setItem(DEMO_KEY, "1");
    setDemoOn(true);
  }

  async function signOut() {
    localStorage.removeItem(DEMO_KEY);
    setDemoOn(false);
    if (supabase && account) await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, hasBackend: !!supabase, signUp, signIn, signOut, demo, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
