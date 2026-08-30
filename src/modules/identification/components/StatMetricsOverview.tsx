"use client";

import React from "react";
import { Activity, AlertTriangle, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { useIdentificationStore } from "../store/identification.store";

export function StatMetricsOverview() {
    const { profile, reassessCompetencies } = useIdentificationStore();

    return (
        <div className="space-y-6">
            {/* Top Banner with Cyber Persona & Quick Action */}
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface/70 p-6 backdrop-blur-xl dark:glow-cyan">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-accent/20 px-3 py-0.5 text-xs font-semibold text-accent">
                                SIH Problem Statement 26101
                            </span>
                            <span className="text-xs text-muted">Node Active</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                            Skill Intelligence & Competency Engine
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                            Official Statistical System profile for <span className="font-semibold text-foreground">{profile.role}</span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={reassessCompetencies}
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-background transition-all hover:bg-accent-hover dark:glow-cyan cursor-pointer"
                    >
                        <Sparkles size={16} className="transition-transform group-hover:rotate-12" />
                        <span>Recalibrate AI Matrix</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Metric 1 */}
                <div className="rounded-xl border border-border bg-surface/50 p-5 backdrop-blur-md transition-all hover:border-accent/40">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted">Official Readiness</span>
                        <div className="rounded-lg bg-accent/15 p-2 text-accent">
                            <Activity size={18} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">{profile.overallReadiness}%</span>
                        <span className="text-xs font-semibold text-emerald-400">+4.2% this month</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                        <div
                            className="h-full rounded-full bg-accent transition-all duration-500"
                            style={{ width: `${profile.overallReadiness}%` }}
                        />
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="rounded-xl border border-border bg-surface/50 p-5 backdrop-blur-md transition-all hover:border-accent/40">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted">Critical Gaps</span>
                        <div className="rounded-lg bg-rose-500/15 p-2 text-rose-400">
                            <AlertTriangle size={18} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-rose-400">{profile.gapsIdentified}</span>
                        <span className="text-xs text-muted">Prioritized for resolution</span>
                    </div>
                    <p className="mt-3 text-xs text-muted">High-priority indicators in CPI & Pipelines</p>
                </div>

                {/* Metric 3 */}
                <div className="rounded-xl border border-border bg-surface/50 p-5 backdrop-blur-md transition-all hover:border-accent/40">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted">iGOT Karmayogi</span>
                        <div className="rounded-lg bg-purple-500/15 p-2 text-accent-purple-light">
                            <BookOpen size={18} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">{profile.iGotHoursRecommended}h</span>
                        <span className="text-xs text-muted">Curated modules</span>
                    </div>
                    <p className="mt-3 text-xs text-muted">4 tailored courses aligned with MoSPI</p>
                </div>

                {/* Metric 4 */}
                <div className="rounded-xl border border-border bg-surface/50 p-5 backdrop-blur-md transition-all hover:border-accent/40">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted">Validated Benchmarks</span>
                        <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-400">
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">{profile.competenciesAnalyzed}</span>
                        <span className="text-xs text-muted">Indicators tested</span>
                    </div>
                    <p className="mt-3 text-xs text-muted">NSSO, NAS, CPI, Big Data metrics</p>
                </div>
            </div>
        </div>
    );
}