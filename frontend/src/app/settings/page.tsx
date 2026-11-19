"use client";
import Link from "next/link";
import { useState } from "react";
import { api, getErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  if (!loading && !user) return <main className="explore-page"><h1>Sign in to manage settings</h1><Link className="btn btn-primary" href="/login">Log in</Link></main>;
  return <main className="explore-page"><Link href="/dashboard" className="text-link">← Dashboard</Link><h1>Settings</h1><div className="dash-card" style={{maxWidth:620}}><h3>Change password</h3>{message && <div className="form-success">{message}</div>}<form className="auth-form" onSubmit={async (event) => { event.preventDefault(); setMessage(""); try { const { data } = await api.put("/api/users/change-password", { currentPassword, newPassword }); setMessage(data.message); setCurrentPassword(""); setNewPassword(""); } catch (error) { setMessage(getErrorMessage(error)); } }}><label className="field">Current password<input type="password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><label className="field">New password<input type="password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label><button className="btn btn-primary">Update password</button></form></div></main>;
}
