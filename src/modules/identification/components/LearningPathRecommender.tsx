"use client";

import React from "react";
import { BookOpen, Check, ChevronRight, Clock, Award, ExternalLink } from "lucide-react";
import { useIdentificationStore } from "../store/identification.store";

export function LearningPathRecommender() {
    const { profile, toggleMilestoneComplete } = useIdentificationStore();

    return (
        <div className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-accent-purple/20 px-2 py-0.5 text-xs font-semibold text-accent-purple-light">
                            AI Generated Roadmap
                        </span>
                        <span className="text-xs text-muted">Synced with iGOT Karmayogi</span>
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-foreground">
                        Personalized Competency Milestone Path
                    </h2>
                </div>

                <div className="text-xs text-muted">
                    Click checkmark to simulate milestone completion
                </div>
            </div>

            {/* Milestones Stepper */}
            <div className="mt-6 space-y-4">
                {profile.learningRoadmap.map((milestone) => (
                    <div
                        key={milestone.id}
                        className={`group relative flex flex-col gap-4 rounded-xl border p-5 transition-all sm:flex-row sm:items-center sm:justify-between ${milestone.completed
                                ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10"
                                : "border-border bg-surface/70 hover:border-accent/40"
                            }`}
                    >
                        {/* Left: Step number & main info */}
                        <div className="flex items-start gap-4">
                            <button
                                type="button"
                                onClick={() => toggleMilestoneComplete(milestone.id)}
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${milestone.completed
                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                        : "border border-border bg-surface-alt text-muted group-hover:border-accent group-hover:text-accent"
                                    }`}
                                title={milestone.completed ? "Mark as in progress" : "Mark as completed"}
                            >
                                {milestone.completed ? <Check size={18} /> : milestone.stepNumber}
                            </button>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold text-accent-purple-light">
                                        {milestone.provider}
                                    </span>
                                    <span className="text-muted">•</span>
                                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                                        <Clock size={12} />
                                        {milestone.duration}
                                    </span>
                                    <span className="text-muted">•</span>
                                    <span className="rounded bg-surface-alt px-1.5 py-0.5 text-[10px] font-medium text-muted">
                                        {milestone.level}
                                    </span>
                                </div>

                                <h3
                                    className={`mt-1 text-base font-semibold ${milestone.completed
                                            ? "text-emerald-300 line-through opacity-80"
                                            : "text-foreground"
                                        }`}
                                >
                                    {milestone.title}
                                </h3>

                                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    {milestone.skillsTargeted.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-md border border-border bg-surface-alt/60 px-2 py-0.5 text-[11px] text-muted"
                                        >
                                            Target: {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Yield boost & action */}
                        <div className="flex shrink-0 items-center justify-between sm:flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                            <div className="flex items-center gap-1 text-xs font-semibold text-accent">
                                <Award size={14} />
                                <span>+{milestone.scoreYield}% Readiness</span>
                            </div>

                            <a
                                href="https://igotkarmayogi.gov.in"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                            >
                                <span>Access Course</span>
                                <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}