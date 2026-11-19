"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { api, getErrorMessage } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <BrainCircuit size={20} />
          </span>
          QuizMaster
        </Link>
        <h1>Create account</h1>
        <p>Start building knowledge that lasts.</p>
        {error && <div className="form-error">{error}</div>}
        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            if (form.password !== form.confirmPassword) {
              setError("Passwords do not match.");
              setLoading(false);
              return;
            }
            try {
              await api.post("/api/auth/register", form);
              await refresh();
              router.push("/dashboard");
            } catch (err) {
              setError(getErrorMessage(err));
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="field">
            Username
            <input
              required
              minLength={3}
              maxLength={24}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="learner123"
            />
          </label>
          <label className="field">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
            />
          </label>
          <label className="field">
            Confirm password
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Repeat password"
            />
          </label>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#6553d9", fontWeight: 800 }}
          >
            Sign in
          </Link>
        </p>
      </section>
      <aside className="auth-art">
        <div>
          <BrainCircuit size={74} />
          <h2>
            Turn curiosity
            <br />
            into progress.
          </h2>
          <p>
            Take quizzes, complete daily challenges, earn points, and watch your
            skills grow.
          </p>
        </div>
      </aside>
    </main>
  );
}
