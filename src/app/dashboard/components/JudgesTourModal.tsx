"use client";

import React, { useState } from "react";
import {
    Sparkles,
    Bot,
    Award,
    Download,
    CheckCircle2,
    ChevronRight,
    X,
    Layers,
    Activity,
    Cpu,
    Flame,
    ShieldCheck,
} from "lucide-react";

interface JudgesTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTriggerCopilot: () => void;
    onTriggerQuiz: () => void;
    onTriggerExport: () => void;
}

interface TourPillar {
    title: string;
    badge: string;
    icon: React.ElementType;
    description: string;
    techHighlight: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function JudgesTourModal({
    isOpen,
    onClose,
    onTriggerCopilot,
    onTriggerQuiz,
    onTriggerExport,
}: JudgesTourModalProps) {
    const [activeTab, setActiveTab] = useState<number>(0);

    if (!isOpen) return null;

    const pillars: TourPillar[] = [
        {
            title: "1. 3D Neural Network & Cyber Aesthetic",
            badge: "Visual Engine",
            icon: Cpu,
            description:
                "GPU-accelerated Three.js/R3F particle mesh with custom GLSL shaders. Simulates neural synaptic data streams running in a single draw call with zero framerate degradation.",
            techHighlight: "Three.js r170, React Three Fiber v9, Additive Blending, DPR Capping",
        },
        {
            title: "2. MoSPI Competency Mapping & Gap Engine",
            badge: "Core AI Logic",
            icon: Activity,
            description:
                "Dynamic intelligence matrix calibrated for India's Official Statistical System (SIH 26101). Analyzes skill proficiency vs. national benchmarks across NSSO, CPI, and National Accounts (SNA 2008).",
            techHighlight: "Decoupled Architecture, Dynamic Delta Weighting, Micro-indicators",
        },
        {
            title: "3. Statistical AI Copilot with Instant RAG",
            badge: "Knowledge Engine",
            icon: Bot,
            description:
                "Domain-specialized assistant answering survey methodologies, sampling multipliers, and elementary index aggregations with interactive suggested action chips.",
            techHighlight: "Tailored Context Memory, MoSPI/iGOT Taxonomy, Animated Typing States",
            actionLabel: "Try AI Copilot",
            onAction: () => {
                onClose();
                onTriggerCopilot();
            },
        },
        {
            title: "4. Adaptive Assessment & iGOT Sync",
            badge: "Retention & Training",
            icon: Award,
            description:
                "Real-time MCQ assessment testing official sampling and price statistics. Awards micro-credentials and dynamically updates live dashboard competency scores upon completion.",
            techHighlight: "Instant Rationales, Dynamic Dashboard Yield Boost, iGOT Course Linking",
            actionLabel: "Launch Practice Assessment",
            onAction: () => {
                onClose();
                onTriggerQuiz();
            },
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-3xl rounded-2xl border border-accent/40 bg-surface/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl dark:glow-cyan flex flex-col justify-between max-h-[92vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted hover:text-foreground text-lg font-bold p-1 cursor-pointer transition-colors"
                    aria-label="Close Tour"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                            <Sparkles size={13} />
                            SIH 26101 Presentation Suite
                        </span>
                        <span className="text-xs text-muted">Akashic Records Platform</span>
                    </div>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
                        Judges&apos; Walkthrough & Architectural Blueprint
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-muted">
                        Quick-reference guide highlighting the AI skill intelligence and official statistical system innovations.
                    </p>
                </div>

                {/* Pillar Tabs */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pillars.map((pillar: TourPillar, idx: number) => {
                        const Icon = pillar.icon as any;
                        const isSelected = activeTab === idx;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveTab(idx)}
                                className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all cursor-pointer ${isSelected
                                        ? "border-accent bg-accent/15 text-foreground font-semibold shadow-sm"
                                        : "border-border bg-surface-alt/40 text-muted hover:border-accent/40 hover:text-foreground"
                                    }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <Icon size={16} className={isSelected ? "text-accent" : "text-muted"} />
                                    <span className="text-[10px] font-bold text-muted uppercase">Pillar {idx + 1}</span>
                                </div>
                                <span className="text-xs line-clamp-1 mt-1">{pillar.badge}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Active Pillar Details Card */}
                {(() => {
                    const current = pillars[activeTab];
                    const CurrentIcon = current.icon as any;
                    return (
                        <div className="mt-5 rounded-xl border border-border/80 bg-surface-alt/60 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                                        <CurrentIcon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-foreground">{current.title}</h3>
                                        <span className="text-xs text-purple-400 font-medium">{current.badge}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm leading-relaxed text-muted">
                                {current.description}
                            </p>

                            <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                                <span className="text-[11px] uppercase font-semibold text-muted block mb-1">
                                    Core Technologies:
                                </span>
                                <span className="text-xs font-mono text-accent">{current.techHighlight}</span>
                            </div>

                            {current.actionLabel && current.onAction && (
                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={current.onAction}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-bold text-background transition-all hover:bg-accent-hover dark:glow-cyan cursor-pointer"
                                    >
                                        <span>{current.actionLabel}</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Quick Demo Shortcuts Banner */}
                <div className="mt-6 pt-4 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                        <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                        <span>Ready for live hackathon evaluation.</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onTriggerExport();
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-alt px-3.5 py-2 text-xs font-semibold text-foreground hover:border-accent transition-all cursor-pointer"
                        >
                            <Download size={13} />
                            <span>Export Compliance Report</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-background hover:bg-accent-hover transition-all cursor-pointer"
                        >
                            <span>Done</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}