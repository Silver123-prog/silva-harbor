import { createContext, useContext, useState } from "react";
import { demoTasks, tasksKey } from "../data/seed.js";

const AuthContext = createContext(null);
const USERS_KEY = "harbor-users";
const SESSION_KEY = "harbor-session";

/* NOTE: accounts live in this browser's localStorage. Passwords are salted and
   hashed (PBKDF2), but there is no server, so accounts do not follow a person
   to another device. See the README for how to swap in a real backend. */

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
};
const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const toB64 = (bytes) => btoa(String.fromCharCode(...bytes));
const fromB64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

async function hashPassword(password, saltB64) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: fromB64(saltB64), iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return toB64(new Uint8Array(bits));
}

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const start = (u) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  async function signUp({ name, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) throw new Error("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) throw new Error("Enter a valid email address.");
    if (password.length < 8) throw new Error("Use a password with at least 8 characters.");

    const users = readUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error("An account with this email already exists. Log in instead.");
    }
    const salt = toB64(crypto.getRandomValues(new Uint8Array(16)));
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: cleanEmail,
      salt,
      hash: await hashPassword(password, salt),
    };
    writeUsers([...users, newUser]);
    start(publicUser(newUser));
  }

  async function signIn({ email, password }) {
    const found = readUsers().find((u) => u.email === email.trim().toLowerCase());
    const ok = found && (await hashPassword(password, found.salt)) === found.hash;
    if (!ok) throw new Error("Email or password is incorrect.");
    start(publicUser(found));
  }

  function demo() {
    if (!localStorage.getItem(tasksKey("demo"))) {
      localStorage.setItem(tasksKey("demo"), JSON.stringify(demoTasks));
    }
    start({ id: "demo", name: "Demo", email: "" });
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, signUp, signIn, signOut, demo }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
