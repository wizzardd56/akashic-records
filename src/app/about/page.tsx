"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Users, Brain, FileText, BarChart3, Shield, Zap, Globe, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#0a0f1a] to-[#060a14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,242,255,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(124,58,237,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/40">
            <Sparkles size={12} className="text-cyan-400" />
            <span>SIH 26101 &bull; MoSPI</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-semibold text-cyan-400">
            <Sparkles size={14} className="animate-pulse" />
            <span>SIH 26101 &bull; India&apos;s Official Statistical System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Akashic Records
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-white/50 leading-relaxed">
            An AI-powered competency assessment and capacity-building platform built for India&apos;s Official Statistical System under the Ministry of Statistics and Programme Implementation (MoSPI).
          </p>
        </section>

        {/* What Is This Project? */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400">
              <Target size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">What Is This Project?</h2>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Akashic Records integrates with the <strong className="text-white">iGOT Karmayogi</strong> ecosystem to identify skill gaps, generate personalized quizzes, analyze uploaded documents, and provide real-time AI tutoring for government statistical officers and students. The platform bridges competency gaps across NSSO, PLFS, CPI, IIP, and SNA 2008 benchmarks.
          </p>
        </section>

        {/* Problem Statement */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Problem Statement (SIH 26101)</h2>
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            India&apos;s Official Statistical System needs a digital platform that can:
          </p>
          <ul className="space-y-3">
            {[
              "Assess the competency of statistical personnel against official benchmarks (NSSO, PLFS, CPI, IIP, SNA 2008)",
              "Identify skill gaps and recommend personalized learning paths",
              "Provide AI-powered assistance for statistical methodologies",
              "Enable document intelligence — upload papers, get summaries, and chat with them",
              "Track progress with cloud-synced dashboards",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Key Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Brain size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Key Features</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Zap, title: "AI-Powered Quizzes", desc: "4 AI-generated MCQs per session, tailored to your course level with instant scoring" },
              { icon: Brain, title: "Behavioral Copilot", desc: "Adaptive chatbot that analyzes your learning velocity and adjusts tone and pacing" },
              { icon: FileText, title: "Document Intelligence", desc: "Upload PDF/TXT/MD/CSV/JSON files for instant AI summaries and Q&A" },
              { icon: BarChart3, title: "Competency Dashboard", desc: "Real-time KPIs, skill gap analysis, and progress tracking across 4 domains" },
              { icon: Shield, title: "Gamified Learning", desc: "Streaks, leaderboards, verified skill badges, and competitive rankings" },
              { icon: Users, title: "Course-Adaptive AI", desc: "8 course paths from 10th Board to BTech CS — AI adapts to your level" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-cyan-400/30 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon size={18} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Tech Stack</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Framework", value: "Next.js 15 (App Router)" },
              { label: "Language", value: "TypeScript" },
              { label: "Styling", value: "Tailwind CSS v4" },
              { label: "AI (Primary)", value: "Groq Cloud (allam-2-7b)" },
              { label: "AI (Fallback)", value: "Google Gemini (flash-lite)" },
              { label: "Database", value: "Supabase (PostgreSQL)" },
              { label: "Auth", value: "Supabase Auth (Google OAuth + Email)" },
              { label: "Deployment", value: "Vercel (Edge Runtime)" },
            ].map(({ label, value }, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
              >
                <span className="text-xs font-semibold text-white/40">{label}</span>
                <span className="text-xs font-bold text-white/80">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <Users size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Team</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Kavya Parmar", role: "Team Leader" },
              { name: "Yash Patel", role: "Member" },
              { name: "Sujal Leuva", role: "Member" },
              { name: "Sujal Lohana", role: "Member" },
              { name: "Hiren Prajapati", role: "Member" },
              { name: "Damini Jadav", role: "Member" },
            ].map(({ name, role }, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 text-center transition-all ${
                  i === 0
                    ? "border-amber-500/30 bg-amber-500/5 sm:col-span-2 lg:col-span-3"
                    : "border-white/10 bg-white/[0.02] hover:border-cyan-400/20"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{role}</p>
                <p className={`font-bold ${i === 0 ? "text-lg text-amber-400" : "text-sm text-white"}`}>{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why This Matters */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white text-center">Why This Matters</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Bridges Skill Gaps", desc: "Identifies exactly where officers need training against official benchmarks" },
              { title: "Personalized Learning", desc: "Adapts to course/board level — from 10th to BTech CS" },
              { title: "AI-Powered", desc: "Real-time assistance, not static content — 3 providers with auto-fallback" },
              { title: "Document Intelligence", desc: "Upload any paper, get instant analysis and quiz generation" },
              { title: "Cloud-Synced", desc: "Progress saved across devices via Supabase PostgreSQL" },
              { title: "Accessible", desc: "Works on any device, supports guest mode for quick exploration" },
            ].map(({ title, desc }, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                <div>
                  <span className="font-bold text-white">{title}:</span>{" "}
                  <span className="text-white/50">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Back Button */}
        <section className="text-center pt-8 pb-16">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-8 py-4 font-bold text-cyan-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-400/20 hover:shadow-lg hover:shadow-cyan-400/10"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
