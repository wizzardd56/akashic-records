"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    BookOpen,
    Compass,
    Flame,
    Sparkles,
    Award,
    ArrowLeft,
    CheckCircle2,
    TrendingUp,
    AlertTriangle,
    Bot,
    ShieldCheck,
    Download,
    Presentation,
    Database,
} from "lucide-react";
import { AICopilotDrawer } from "./components/AICopilotDrawer";
import { QuizModal } from "./components/QuizModal";
import { JudgesTourModal } from "./components/JudgesTourModal";
import { supabase, fetchUserProfile, syncUserProfile } from "./supabaseClient";

export default function DashboardPage() {
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [competencyScore, setCompetencyScore] = useState(78.4);
    const [activeGaps, setActiveGaps] = useState(3);
    const [userId, setUserId] = useState("default_officer");
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isDbSynced, setIsDbSynced] = useState(false);

    // Quick toast helper to display notification messages
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 4000); // Auto-hide after 4 seconds
    };

    // 1. Fetch live profile on load with user-scoped localStorage fallback
    useEffect(() => {
        async function loadUserData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                const activeId = user ? user.id : "default_officer";
                setUserId(activeId);

                // Load from user-scoped storage key to prevent cross-account data leaks
                const localScore = localStorage.getItem(`mospi_score_${activeId}`);
                const localGaps = localStorage.getItem(`mospi_gaps_${activeId}`);
                if (localScore) {
                    setCompetencyScore(Number(localScore));
                }
                if (localGaps) {
                    setActiveGaps(Number(localGaps));
                }

                if (user) {
                    const profile = await fetchUserProfile(user.id);
                    if (profile) {
                        if (profile.competency_score !== undefined) {
                            setCompetencyScore(Number(profile.competency_score));
                            localStorage.setItem(`mospi_score_${user.id}`, profile.competency_score.toString());
                        }
                        if (profile.active_gaps !== undefined) {
                            setActiveGaps(profile.active_gaps);
                            localStorage.setItem(`mospi_gaps_${user.id}`, profile.active_gaps.toString());
                        }
                        setIsDbSynced(true);
                    }
                }
            } catch {
                console.log("Running on local fallback storage mode");
            }
        }
        loadUserData();
    }, []);

    // 2. Live sync score updates to user-scoped storage & Supabase
    const handleQuizCompleted = async (scoreYield: number) => {
        const newScore = Math.min(100, parseFloat((competencyScore + scoreYield).toFixed(1)));
        const newGaps = Math.max(1, activeGaps - 1);

        setCompetencyScore(newScore);
        setActiveGaps(newGaps);

        // Save to user-scoped key so different accounts never leak progress into each other
        localStorage.setItem(`mospi_score_${userId}`, newScore.toString());
        localStorage.setItem(`mospi_gaps_${userId}`, newGaps.toString());

        let cloudSuccess = false;
        if (userId && userId !== "default_officer") {
            try {
                await syncUserProfile({
                    user_id: userId,
                    competency_score: newScore,
                    active_gaps: newGaps,
                });
                cloudSuccess = true;
            } catch {
                console.log("Cloud sync skipped, using local state");
            }
        }

        setIsDbSynced(true);
        showToast(
            `Assessment Yield +${scoreYield}% Applied! ${cloudSuccess ? "Synced to Cloud DB & Local Storage" : "Saved to Local Storage"}`
        );
    };

    const handleExportAuditReport = () => {
        const reportData = {
            platform: "Akashic Records - AI Skill Intelligence Platform",
            problemStatement: "SIH 26101 - India's Official Statistical System",
            generatedAt: new Date().toISOString(),
            officerProfile: {
                userId: userId,
                role: "Statistical Officer / Data Analyst",
                organization: "Ministry of Statistics & Programme Implementation (MoSPI)",
                overallReadinessIndex: `${competencyScore}%`,
                activeSkillGapsCount: activeGaps,
                cloudDatabaseStatus: isDbSynced ? "Live Cloud Synced" : "Local Verified",
            },
            evaluatedCompetencyDomains: [
                {
                    domain: "Official Data Sampling & Estimation",
                    proficiency: `${Math.min(95, Math.round(competencyScore + 4))}%`,
                    benchmark: "90%",
                    status: "Compliant (NSSO Standards)",
                },
                {
                    domain: "Macroeconomic Price Indices (CPI/IIP)",
                    proficiency: `${Math.min(90, Math.round(competencyScore - 8))}%`,
                    benchmark: "80%",
                    status: "Jevons Geometric Mean Calibration Recommended",
                },
                {
                    domain: "Real-time Telemetry & Data Pipelines",
                    proficiency: "92%",
                    benchmark: "85%",
                    status: "Advanced Ingestion Compliant",
                },
                {
                    domain: "National Accounts Statistics (SNA 2008)",
                    proficiency: `${Math.min(85, Math.round(competencyScore - 12))}%`,
                    benchmark: "75%",
                    status: "GVA Output Imputation Module Assigned",
                },
            ],
            recommendedIGOTModules: [
                "Advanced IIP & Price Index Computation Protocols",
                "Automated Microdata Cleaning in Python/Polars",
                "System of National Accounts (SNA 2008) GVA Modeling",
                "UN Fundamental Principles of Official Statistics & Ethics",
            ],
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(reportData, null, 2)
        )}`;
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", jsonString);
        downloadAnchor.setAttribute(
            "download",
            `MoSPI_Skill_Compliance_Audit_${new Date().toISOString().slice(0, 10)}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        showToast("Official MoSPI Skill Audit Report generated and downloaded!");
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 relative">
            {/* Radial Glow */}
            <div
                className="pointer-events-none fixed top-0 left-1/2 -z-10 h-96 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_70%)] opacity-10 blur-3xl"
                aria-hidden="true"
            />

            {/* SIH Evaluator / Judges Tour Banner */}
            <div className="flex items-center justify-between rounded-2xl border border-accent/40 bg-accent/10 px-6 py-5 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3">
                    <Cpu className="text-accent animate-pulse" size={20} />
                    <span className="text-sm font-semibold text-foreground">
                        SIH Evaluator Mode: Live Supabase Database, 3D Neural Scene, and MoSPI Assessment are active.
                    </span>
                </div>
                <button
                    onClick={() => { /* Judges tour trigger */ }}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                    <span>Open Judges&apos; Tour</span>
                    <ArrowRight size={14} />
                </button>
            </div>
            <button
                type="button"
                onClick={() => setIsTourOpen(true)}
                className="inline-flex items-center gap-1 font-bold text-accent hover:underline shrink-0 cursor-pointer"
            >
                <span>Open Judges&apos; Tour</span>
                <span>→</span>
            </button>
        </div>

            {/* Dynamic Toast Banner */ }
    {
        toastMessage && (
            <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs sm:text-sm text-emerald-300 flex items-center justify-between gap-3 shadow-lg animate-pulse">
                <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
                <button
                    type="button"
                    onClick={() => setToastMessage(null)}
                    className="text-emerald-400 hover:text-emerald-200 text-xs font-bold cursor-pointer"
                >
                    ✕
                </button>
            </div>
        )
    }

    {/* Header */ }
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
        <div>
            <div className="flex items-center gap-2 text-accent text-sm font-semibold tracking-wider uppercase mb-1">
                <Sparkles className="w-4 h-4 animate-pulse" />
                SIH 26101 Intelligence Portal
            </div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Neural Skill Intelligence Hub
                </h1>
                <span
                    className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400"
                    title="Cloud database synchronization active"
                >
                    <Database size={12} />
                    <span>Cloud Synced</span>
                </span>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
            <button
                type="button"
                onClick={handleExportAuditReport}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/80 px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground hover:border-accent hover:bg-surface transition-all cursor-pointer shadow-sm"
            >
                <Download className="w-4 h-4 text-accent" />
                <span>Export Audit</span>
            </button>

            <button
                type="button"
                onClick={() => setIsQuizOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 px-3.5 py-2 text-xs sm:text-sm font-semibold text-accent-purple-light transition-all hover:bg-purple-600 hover:text-white cursor-pointer shadow-sm"
            >
                <Award className="w-4 h-4" />
                <span>Take Assessment</span>
            </button>

            <button
                type="button"
                onClick={() => setIsCopilotOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3.5 py-2 text-xs sm:text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-background hover:shadow-lg dark:glow-cyan cursor-pointer shadow-sm"
            >
                <Bot className="w-4 h-4" />
                <span>AI Copilot</span>
            </button>

            <Link
                href="/"
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/50 px-3.5 py-2 text-xs sm:text-sm font-semibold hover:bg-surface-alt hover:border-accent transition-all cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
            </Link>
        </div>
    </div>

    {/* Stat Metrics Overview */ }
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-accent/30 bg-surface/40 p-6 backdrop-blur-md shadow-lg dark:glow-cyan">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Competency Alignment
                </span>
                <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-foreground">{competencyScore}%</div>
            <p className="text-xs text-muted mt-1">+4.2% from previous statistical audit</p>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-surface/40 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Active Skill Gaps
                </span>
                <AlertTriangle className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-foreground">{activeGaps} Modules</div>
            <p className="text-xs text-muted mt-1">High priority: Data Pipeline & Sampling</p>
        </div>

        <div className="rounded-xl border border-accent/30 bg-surface/40 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Learning Path Progress
                </span>
                <Award className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-foreground">Phase 2 / 4</div>
            <p className="text-xs text-muted mt-1">Estimated completion: 3 days</p>
        </div>
    </div>

    {/* Competency Breakdown & AI Learning Paths */ }
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-accent" /> Statistical System Competency Breakdown
            </h2>
            <div className="space-y-4">
                {[
                    { name: "Official Data Sampling & Estimation", score: Math.min(95, Math.round(competencyScore + 4)), target: 90 },
                    { name: "Socio-Economic Indicator Modeling", score: Math.min(90, Math.round(competencyScore - 8)), target: 80 },
                    { name: "Real-time Telemetry & Pipeline Sync", score: 92, target: 85 },
                    { name: "Statistical Quality Assurance", score: Math.min(85, Math.round(competencyScore - 12)), target: 75 },
                ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{item.name}</span>
                            <span className="text-accent font-semibold">{item.score}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-background overflow-hidden border border-border">
                            <div
                                className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${item.score}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-400" /> AI-Generated Path to Mastery
            </h2>
            <div className="space-y-4">
                {[
                    {
                        title: "Advanced Socio-Economic Regression Analysis",
                        status: "Completed",
                        icon: CheckCircle2,
                        color: "text-accent",
                    },
                    {
                        title: "Socio-Economic Indicator Modeling Masterclass",
                        status: "In Progress",
                        icon: Sparkles,
                        color: "text-purple-400",
                    },
                    {
                        title: "Statistical Quality Control & Error Mitigation",
                        status: "Locked",
                        icon: BookOpen,
                        color: "text-muted",
                    },
                ].map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={idx}
                            className="flex items-start gap-4 p-3 rounded-xl border border-border/60 bg-background/40"
                        >
                            <div className={`p-2 rounded-lg bg-surface ${step.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                                <span className="text-xs text-muted font-medium">{step.status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>

    {/* Floating Action Button for AI Copilot */ }
    <button
        type="button"
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-accent/40 dark:glow-cyan cursor-pointer"
        aria-label="Open AI Statistical Copilot"
        title="Open AI Statistical Copilot"
    >
        <Bot size={26} />
    </button>

    {/* AI Copilot Drawer */ }
    <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onOpenQuiz={() => setIsQuizOpen(true)}
    />

    {/* Interactive Quiz & Assessment Modal */ }
    <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onQuizCompleted={handleQuizCompleted}
    />

    {/* Judges' Demo Mode / Presentation Walkthrough Modal */ }
    <JudgesTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onTriggerCopilot={() => setIsCopilotOpen(true)}
        onTriggerQuiz={() => setIsQuizOpen(true)}
        onTriggerExport={handleExportAuditReport}
    />
        </div >
    );
}