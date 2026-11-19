"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, BookmarkCheck, BrainCircuit, CalendarDays, Flame, LayoutDashboard, LogOut, Search, Settings, Trophy, UserCircle, History } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const links=[{href:"/dashboard",icon:LayoutDashboard,label:"Overview"},{href:"/explore",icon:Search,label:"Explore"},{href:"/explore",icon:BrainCircuit,label:"All Quizzes"},{href:"/daily-challenge",icon:CalendarDays,label:"Daily Challenge"},{href:"/progress",icon:BarChart3,label:"My Progress"},{href:"/completed",icon:BookmarkCheck,label:"Completed Quizzes"},{href:"/history",icon:History,label:"Quiz History"},{href:"/leaderboard",icon:Trophy,label:"Leaderboard"},{href:"/profile",icon:UserCircle,label:"Profile"},{href:"/settings",icon:Settings,label:"Settings"}];

export default function Dashboard(){
  const {user,loading,logout}=useAuth();
  const [stats,setStats]=useState<any>(null);
  const [activity,setActivity]=useState<any[]>([]);
  const [challenge,setChallenge]=useState<any>(null);
  const [progress,setProgress]=useState<any[]>([]);

  useEffect(()=>{
    if(loading||!user)return;
    Promise.all([
      api.get("/api/dashboard/stats"),
      api.get("/api/dashboard/activity"),
      api.get("/api/dashboard/progress"),
      api.get("/api/challenges/today")
    ]).then(([a,b,c,d])=>{
      setStats(a.data);
      setActivity(b.data);
      setProgress(c.data);
      setChallenge(d.data)
    }).catch(()=>{})
  },[loading,user]);

  if(loading)return <main style={{minHeight:"100vh",display:"grid",placeItems:"center"}}>Loading…</main>;
  if(!user)return <main style={{minHeight:"100vh",display:"grid",placeItems:"center"}}><div style={{textAlign:"center"}}><h1>Sign in to view your dashboard</h1><Link className="btn btn-primary" href="/login">Log in</Link></div></main>;

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark"><BrainCircuit size={20}/></span>
          <span>QuizMaster</span>
        </Link>
        {links.map((l,i)=>
          <Link className={`side-link ${i===0?"active":""}`} href={l.href} target="_blank" rel="noopener noreferrer" key={l.label}>
            <l.icon size={18}/>
            <span>{l.label}</span>
          </Link>
        )}
      </aside>
      <section className="dashboard-main">
        <div className="topbar">
          <button className="side-link" onClick={logout} style={{border:0,background:"transparent",cursor:"pointer"}}>
            <LogOut size={17}/>
            <span>Logout</span>
          </button>
          <div className="avatar" style={{marginLeft:12}}>
            {user.username.slice(0,1).toUpperCase()}
          </div>
        </div>
        <div className="dash-title">
          <h1>Welcome back, {user.username}!</h1>
          <p>Small steps every day lead to big progress.</p>
        </div>
        <div className="stat-grid">
          <div className="dash-card">
            <small>Attempted</small>
            <strong>{stats?.quizzesAttempted??0}</strong>
          </div>
          <div className="dash-card">
            <small>Completed</small>
            <strong>{stats?.quizzesCompleted??0}</strong>
          </div>
          <div className="dash-card">
            <small>Average score</small>
            <strong>{stats?.averageScore??0}%</strong>
          </div>
          <div className="dash-card">
            <small>Learning points</small>
            <strong>{stats?.totalPoints??user.totalPoints}</strong>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="chart-card">
            <h3>Weekly progress</h3>
            <div style={{display:"flex",height:210,gap:12,alignItems:"end",padding:"20px 5px 0"}}>
              {progress.map(d=>
                <div key={d.date} style={{flex:1,textAlign:"center"}}>
                  <div title={`${d.score}%`} style={{height:`${Math.max(d.score,8)*1.5}px`,maxHeight:150,background:d.score?"#6553d9":"#eeecf5",borderRadius:"8px 8px 3px 3px",marginBottom:8}}/>
                  <small>{d.label}</small>
                </div>
              )}
            </div>
          </div>
          <div className="activity-card">
            <h3>Daily challenge</h3>
            {challenge?<>
              <div className="tag">{challenge.quiz.category}</div>
              <h3>{challenge.quiz.title}</h3>
              <p>{challenge.quiz.difficulty} · {challenge.quiz.durationMinutes} min · {challenge.pointsReward} pts</p>
              <Link className="btn btn-primary" style={{width:"100%"}} href={`/quizzes/${challenge.quiz.id}?challenge=${challenge.id}`}>
                {challenge.status==="completed"?"Challenge completed":"Start challenge"}
              </Link>
            </>:<p>Loading today’s challenge…</p>}
            <div style={{marginTop:18,display:"flex",alignItems:"center",gap:8}}>
              <Flame color="#f59e0b"/>
              <b>{stats?.currentStreak??0} day streak</b>
            </div>
          </div>
        </div>
        <div className="dashboard-grid" style={{marginTop:14}}>
          <div className="activity-card">
            <h3>Recent activity</h3>
            {activity.length?activity.map(a=>
              <div className="activity-row" key={a.id}>
                <BrainCircuit size={20} color="#6553d9"/>
                <div>
                  <b>{a.quiz?.title??"Quiz"}</b>
                  <br/>
                  <small>{a.completedAt?new Date(a.completedAt).toLocaleDateString():"Recently"}</small>
                </div>
                <span>{a.score}%</span>
              </div>
            ):<p>No completed quizzes yet. Start one to build momentum.</p>}
          </div>
          <div className="activity-card">
            <h3>Continue learning</h3>
            <p>Your next challenge is waiting.</p>
            <Link className="btn btn-secondary" style={{width:"100%"}} href="/explore">
              Explore quizzes
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
