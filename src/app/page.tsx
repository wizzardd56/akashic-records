"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, UserCheck, ArrowRight, X, Info } from "lucide-react";
import { supabase } from "./dashboard/supabaseClient";
import { StarField } from "../shared/components/StarField";
import { useCourse } from "../shared/providers/CourseProvider";
import { OnboardingCourseModal } from "../shared/components/OnboardingCourseModal";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { hasOnboarded, completeOnboarding } = useCourse();

  // Check if user is already authenticated on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsLoggedIn(true);
        }
      } catch {
        // Fallback gracefully
      }
    }
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    // Always show auth first, then onboarding
    setIsAuthModalOpen(true);
  };

  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (courseId: any) => {
    // Save the course selection to localStorage
    localStorage.setItem("akashic_course", courseId);
    window.location.href = "/dashboard";
  };

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
      setIsAuthModalOpen(false);
      setShowOnboarding(true);
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Starfield background */}
      <StarField />

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10 py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 mb-6 backdrop-blur-md">
          <Sparkles size={14} className="animate-pulse text-cyan-400" />
          <span>SIH 26101 &bull; India&apos;s Official Statistical System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 text-white">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Akashic Records
          </span>
        </h1>

        <p className="text-sm sm:text-base text-white/50 max-w-2xl mb-10 leading-relaxed">
          AI-powered Skill Intelligence Platform for MoSPI. Identify competency gaps, analyze macroeconomic indicators, query document sources, and master your domain.
        </p>

        {/* Get Started Action Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={handleGetStarted}
            className="group flex items-center gap-2 rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-[#05050f] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/30 cursor-pointer"
          >
            <span>GET STARTED</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>

          <Link
            href="/notebook"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white/80 hover:border-white/25 hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer"
          >
            <span>Explore AI Chatbox Workspace</span>
          </Link>

          <Link
            href="/akashic-records-presentation.html"
            target="_blank"
            className="group flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-8 py-4 font-semibold text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/20 transition-all backdrop-blur-md cursor-pointer"
          >
            <Info size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>About Us</span>
          </Link>
        </div>

        <div className="text-xs text-white/30 mt-8">
          Built for SIH 26101 &bull; MoSPI Intelligence Portal
        </div>
      </div>

      {/* Auth / Guest Selection Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Starfield behind modal */}
          <StarField />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAuthModalOpen(false)} />

          {/* Modal Card */}
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111118]/90 p-8 shadow-2xl backdrop-blur-2xl z-10">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">Access Akashic Records</h2>
              <p className="text-xs text-white/40 mt-1">Choose how you wish to enter the intelligence hub</p>
            </div>

            {authError && (
              <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-xs text-red-300">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              {/* Option 1: Continue as Guest */}
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setShowOnboarding(true);
                }}
                className="flex items-center justify-between w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-cyan-400/40 hover:bg-white/8 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-400/15 text-cyan-400">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">Continue as Guest</h4>
                    <p className="text-xs text-white/40">Explore dashboard with local fallback storage</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-white/30 group-hover:text-cyan-400 transition-colors" />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] text-white/30 uppercase font-semibold tracking-wider">Or Login / Register</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Google OAuth Login */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="flex items-center justify-center gap-3 w-full rounded-2xl border border-white/15 bg-white/5 p-3.5 text-xs font-bold text-white/80 hover:bg-cyan-400 hover:text-[#05050f] transition-all cursor-pointer shadow-md"
              >
                <span>Sign in with Google OAuth</span>
              </button>

              {/* Email / Password Form */}
              {/* After auth success, show onboarding next time */}
              <form onSubmit={handleEmailAuth} className="space-y-3 pt-2">
                <div className="flex rounded-xl border border-white/10 bg-white/5 overflow-hidden p-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${authMode === "login" ? "bg-cyan-400 text-[#05050f]" : "text-white/40"}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${authMode === "register" ? "bg-cyan-400 text-[#05050f]" : "text-white/40"}`}
                  >
                    Register
                  </button>
                </div>

                <input
                  type="email"
                  placeholder="Officer Email (e.g. officer@mospi.gov.in)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400/60 outline-none placeholder:text-white/25"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-400/60 outline-none placeholder:text-white/25"
                  required
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 py-3 text-xs font-bold text-[#05050f] hover:bg-cyan-300 transition-all cursor-pointer shadow-lg shadow-cyan-400/20"
                >
                  {authMode === "login" ? "Authenticate Officer Login" : "Register New Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}      {/* Onboarding Course Selection */}
      <OnboardingCourseModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </main>
    );
}
