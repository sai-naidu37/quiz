"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function DailyChallengePage() {
  const { user, loading } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  useEffect(() => { if (!loading && user) api.get("/api/challenges/today").then(({ data }) => setChallenge(data)).catch(() => setChallenge(null)); }, [loading, user]);
  if (!loading && !user) return <main className="explore-page"><h1>Sign in to open today’s challenge</h1><Link className="btn btn-primary" href="/login">Log in</Link></main>;
  return <main className="explore-page"><Link href="/dashboard" className="text-link">← Dashboard</Link><h1>Daily Challenge</h1>{challenge ? <div className="quiz-detail-card"><span className="tag">{challenge.quiz.category}</span><h2>{challenge.quiz.title}</h2><p>{challenge.quiz.description}</p><div className="quiz-meta"><span>{challenge.quiz.difficulty}</span><span>{challenge.quiz.durationMinutes} minutes</span><span>{challenge.quiz.questionCount} questions</span><span>{challenge.pointsReward} reward points</span></div><span className="tag">Status: {challenge.status}</span><div style={{marginTop:20}}><Link className="btn btn-primary" href={`/quizzes/${challenge.quiz.id}?challenge=${challenge.id}`}>Start challenge</Link></div></div> : <div className="dash-card">Loading today’s challenge…</div>}</main>;
}
