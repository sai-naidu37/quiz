"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function ProgressPage() {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { if (!loading && user) Promise.all([api.get("/api/dashboard/progress"), api.get("/api/dashboard/stats")]).then(([a, b]) => { setProgress(a.data); setStats(b.data); }).catch(() => {}); }, [loading, user]);
  if (!loading && !user) return <main className="explore-page"><h1>Sign in to view progress</h1><Link className="btn btn-primary" href="/login">Log in</Link></main>;
  return <main className="explore-page"><Link href="/dashboard" className="text-link">← Dashboard</Link><h1>My Progress</h1><div className="stat-grid"><div className="dash-card"><small>Completed</small><strong>{stats?.quizzesCompleted ?? 0}</strong></div><div className="dash-card"><small>Average score</small><strong>{stats?.averageScore ?? 0}%</strong></div><div className="dash-card"><small>Highest score</small><strong>{stats?.highestScore ?? 0}%</strong></div><div className="dash-card"><small>Current streak</small><strong>{stats?.currentStreak ?? 0}</strong></div></div><div className="chart-card" style={{marginTop:14}}><h3>Last 7 days</h3><div style={{display:"flex",height:220,gap:12,alignItems:"end",padding:"20px 5px 0"}}>{progress.map((day) => <div key={day.date} style={{flex:1,textAlign:"center"}}><div title={`${day.score}%`} style={{height:`${Math.max(day.score,8)*1.5}px`,maxHeight:150,background:day.score ? "#6553d9" : "#eeecf5",borderRadius:"8px 8px 3px 3px",marginBottom:8}}/><small>{day.label}</small></div>)}</div></div></main>;
}
