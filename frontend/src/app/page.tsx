"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, Clock3, Globe2, Medal, Sparkles, Trophy, Users } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  useEffect(() => { api.get("/api/quizzes", { params: { limit: 3 } }).then(({ data }) => setQuizzes(data.items ?? data)).catch(() => setQuizzes([])); }, []);
  const categories = ["Programming", "General Knowledge", "Science", "Mathematics", "Technology", "History", "English", "Logical Reasoning"];

  return (
    <main>
      <nav className="nav"><Link className="brand" href="/"><span className="brand-mark"><BrainCircuit size={21}/></span>QuizMaster</Link>
        <div className="nav-links"><Link href="/">Home</Link><Link href="/dashboard">Dashboard</Link><Link href="/explore">Explore</Link><Link href="/explore">Quizzes</Link><a href="#about">About Us</a></div>
        <div className="nav-actions">{user ? <Link className="btn btn-primary btn-small" href="/dashboard">Dashboard</Link> : <><Link className="btn btn-ghost btn-small" href="/login">Log in</Link><Link className="btn btn-primary btn-small" href="/register">Sign up</Link></>}</div>
      </nav>

      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={15}/> Learn smarter every day</div><h1>Challenge your mind.<br/><span>Test your knowledge.</span></h1><p>Build skills with engaging quizzes, daily challenges, and progress insights designed to keep you learning.</p><div className="hero-actions"><Link className="btn btn-primary" href={user ? "/dashboard" : "/register"}>Start learning <ArrowRight size={18}/></Link><Link className="btn btn-secondary" href="/explore">Explore quizzes</Link></div></div>
        <div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="floating-card card-a"><Trophy size={20}/><b>Top 10%</b><small>Weekly rank</small></div><div className="brain-card"><div className="brain-icon"><BrainCircuit size={58}/></div><strong>Daily knowledge</strong><div className="mini-progress"><span/></div><small>Keep the streak alive</small></div><div className="floating-card card-b"><Medal size={20}/><b>+250</b><small>Learning points</small></div></div>
      </section>

      <section className="stats"><div><Trophy/><strong>24+</strong><span>Quizzes</span></div><div><CheckCircle2/><strong>180+</strong><span>Questions</span></div><div><Users/><strong>12K+</strong><span>Learners</span></div><div><Medal/><strong>3.8K</strong><span>Challenges</span></div></section>

      <section className="section" id="quizzes"><div className="section-head"><div><span className="kicker">POPULAR NOW</span><h2>Featured quizzes</h2></div><Link href="/explore" className="text-link">View all <ArrowRight size={16}/></Link></div>
        <div className="quiz-grid">{quizzes.length ? quizzes.map((quiz) => <article className="quiz-card" key={quiz.id ?? quiz._id}><div className="quiz-icon"><BrainCircuit/></div><span className="tag">{quiz.category}</span><h3>{quiz.title}</h3><p>{quiz.description}</p><div className="quiz-meta"><span>{quiz.difficulty}</span><span><Clock3 size={14}/>{quiz.durationMinutes} min</span></div><Link className="quiz-button" href={`/quizzes/${quiz.id ?? quiz._id}`}>View quiz <ArrowRight size={16}/></Link></article>) : ["JavaScript Fundamentals","General Knowledge","Science Essentials"].map((title, index) => <article className="quiz-card" key={title}><div className="quiz-icon"><BrainCircuit/></div><span className="tag">{["Programming","General Knowledge","Science"][index]}</span><h3>{title}</h3><p>Build confidence with a carefully designed knowledge challenge.</p><div className="quiz-meta"><span>Beginner</span><span><Clock3 size={14}/>8 min</span></div><Link className="quiz-button" href="/explore">View quiz <ArrowRight size={16}/></Link></article>)}</div>
      </section>

      <section className="section how"><div className="section-head center"><div><span className="kicker">HOW IT WORKS</span><h2>Learning in three simple steps</h2></div></div><div className="steps"><div><span>01</span><h3>Create your account</h3><p>Set up your profile and begin your learning journey.</p></div><div><span>02</span><h3>Choose a quiz</h3><p>Explore topics matched to your interests and skill level.</p></div><div><span>03</span><h3>Track your growth</h3><p>Review results, earn points, and build a learning streak.</p></div></div></section>

      <section className="section"><div className="section-head"><div><span className="kicker">EXPLORE TOPICS</span><h2>Popular categories</h2></div></div><div className="category-grid">{categories.map((category, i) => <Link href={`/explore?category=${encodeURIComponent(category)}`} className="category" key={category}><span>{["<>","?","⚗","π","⌘","◷","Aa","∆"][i]}</span><b>{category}</b><ArrowRight size={16}/></Link>)}</div></section>

      <section className="section challenge"><div><span className="kicker">TODAY’S CHALLENGE</span><h2>One question at a time.<br/>One stronger mind.</h2><p>Complete today’s challenge and keep your streak moving forward.</p><Link className="btn btn-primary" href="/dashboard">Start today’s challenge <ArrowRight size={17}/></Link></div><div className="challenge-card"><div className="challenge-top"><span>DAILY CHALLENGE</span><b>+50 pts</b></div><h3>Mind Sprint</h3><p>Science · Intermediate</p><div className="challenge-meta"><span><Clock3 size={15}/>10 min</span><span>5 questions</span></div></div></section>

      <footer id="about"><Link className="brand" href="/"><span className="brand-mark"><BrainCircuit size={20}/></span>QuizMaster</Link><p>Learn more. Remember better. Progress every day.</p><div><a href="#">Privacy Policy</a><a href="#">Terms</a><a href="mailto:hello@quizmaster.app">Contact</a></div></footer>
    </main>
  );
}
