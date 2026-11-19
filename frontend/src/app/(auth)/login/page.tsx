"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { api, getErrorMessage } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <h1>Welcome back</h1>
        <p>Sign in to continue your learning journey.</p>
        {error && <div className="form-error">{error}</div>}
        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            try {
              await api.post("/api/auth/login", { email, password });
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
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p>
          New to QuizMaster?{" "}
          <Link
            href="/register"
            style={{ color: "#6553d9", fontWeight: 800 }}
          >
            Create an account
          </Link>
        </p>
      </section>
      <aside className="auth-art">
        <div>
          <BrainCircuit size={74} />
          <h2>
            Learn something
            <br />
            new every day.
          </h2>
          <p>
            Join thousands of learners improving their knowledge with focused
            challenges and measurable progress.
          </p>
        </div>
      </aside>
    </main>
  );
}
