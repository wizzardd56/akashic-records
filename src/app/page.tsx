"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SceneContainer } from "@/three/scenes/HeroScene";
import { Navbar } from "@/shared/components/Navbar";
import { Sparkles, ShieldCheck, UserCheck, Compass, ArrowRight, X } from "lucide-react";
import { supabase } from "./dashboard/supabaseClient";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (err: any) {
      setAuthError(err.message || "Google auth failed");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10 py-20">
        <div className="absolute inset-0 -z-10 opacity-70">
          <SceneContainer />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent mb-6 backdrop-blur-md">
          <Sparkles size={14} className="animate-pulse" />
          <span>SIH 26101 • India&apos;s Official Statistical System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Akashic Records</span>
        </h1>

        <p className="text-sm sm:text-base text-muted max-w-2xl mb-10 leading-relaxed">
          AI-powered Skill Intelligence Platform for MoSPI. Identify competency gaps, analyze macroeconomic indicators, query document sources, and master your domain.
        </p>

        {/* Get Started Action Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="group flex items-center gap-2 rounded-2xl bg-accent px-8 py-4 font-bold text-background transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 dark:glow-cyan cursor-pointer"
          >
            <span>GET STARTED</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>

          <Link
            href="/notebook"
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface/60 px-8 py-4 font-semibold text-foreground hover:border-accent transition-all backdrop-blur-md cursor-pointer"
          >
            <span>Explore Notebook Workspace</span>
          </Link>
        </div>

        <div className="text-xs text-muted mt-6">
          Built for SIH 26101 • MoSPI Intelligence Portal
        </div>
      </div>

      {/* Auth / Guest Selection Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-accent/40 bg-surface/90 p-8 shadow-2xl backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-muted hover:text-foreground cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Access Akashic Records</h2>
              <p className="text-xs text-muted mt-1">Choose how you wish to enter the intelligence hub</p>
            </div>

            {authError && (
              <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-xs text-red-300">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              {/* Option 1: Continue as Guest */}
              <Link
                href="/dashboard"
                className="flex items-center justify-between w-full rounded-2xl border border-border bg-background/60 p-4 text-left transition-all hover:border-accent hover:bg-surface group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">Continue as Guest</h4>
                    <p className="text-xs text-muted">Explore dashboard with local fallback storage</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted group-hover:text-accent transition-colors" />
              </Link>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs text-muted uppercase font-semibold">Or Login / Register</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Google OAuth Login */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-3 w-full rounded-2xl border border-accent/40 bg-accent/10 p-3.5 text-xs font-bold text-foreground hover:bg-accent hover:text-background transition-all cursor-pointer shadow-md"
              >
                <span>Sign in with Google OAuth</span>
              </button>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3 pt-2">
                <div className="flex rounded-xl border border-border bg-background overflow-hidden p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${authMode === "login" ? "bg-accent text-background" : "text-muted"}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${authMode === "register" ? "bg-accent text-background" : "text-muted"}`}
                  >
                    Register
                  </button>
                </div>

                <input
                  type="email"
                  placeholder="Officer Email (e.g. officer@mospi.gov.in)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-accent outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-accent outline-none"
                  required
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-accent py-3 text-xs font-bold text-background hover:opacity-90 transition-all cursor-pointer shadow-lg"
                >
                  {authMode === "login" ? "Authenticate Officer Login" : "Register New Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}