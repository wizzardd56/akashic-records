"use client";

import React from "react";
import { AlertCircle, CheckCircle, Flame, Filter } from "lucide-react";
import { useIdentificationStore } from "../store/identification.store";
import { CompetencyCategory, GapSeverity } from "../types/identification.types";

const severityBadgeMap: Record<GapSeverity, { text: string; bg: string; textCol: string }> = {
    critical: { text: "Critical Gap", bg: "bg-rose-500/20", textCol: "text-rose-400" },
    moderate: { text: "Moderate Gap", bg: "bg-amber-500/20", textCol: "text-amber-400" },
    low: { text: "On Benchmark", bg: "bg-emerald-500/20", textCol: "text-emerald-400" },
};

const filterTabs: { key: "all" | CompetencyCategory; label: string }[] = [
    { key: "all", label: "All Indicators" },
    { key: "statistical_core", label: "Statistical Core" },
    { key: "mospi_domain", label: "MoSPI & National Accounts" },
    { key: "digital_analytics", label: "Big Data & Python" },
    { key: "governance_policy", label: "Governance & Ethics" },
];

export function CompetencyBreakdown() {
    const { profile, selectedCategory, setSelectedCategory } = useIdentificationStore();

    const filteredSkills = profile.skills.filter((skill) => {
        if (selectedCategory === "all") return true;
        return skill.category === selectedCategory;
    });

    return (
        <div className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Competency Delta & Skill Matrix</h2>
                    <p className="text-xs text-muted mt-1">
                        Real-time evaluation against India&apos;s Official Statistical System standards
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface-alt/50 p-1">
                    <Filter size={14} className="ml-2 text-muted hidden sm:inline" />
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setSelectedCategory(tab.key)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${selectedCategory === tab.key
                                    ? "bg-accent text-background font-semibold"
                                    : "text-muted hover:text-foreground hover:bg-surface"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skill Cards Grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredSkills.map((skill) => {
                    const badge = severityBadgeMap[skill.severity];

                    return (
                        <div
                            key={skill.id}
                            className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface/70 p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-lg dark:hover:shadow-accent/5"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                                            {skill.officialIndicator}
                                        </span>
                                        <h3 className="mt-1 text-base font-bold text-foreground">{skill.name}</h3>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.textCol}`}>
                                        {skill.severity === "critical" && <Flame size={12} />}
                                        {badge.text}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs leading-relaxed text-muted">{skill.description}</p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-border/60">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-muted">
                                        Proficiency: <span className="text-foreground font-semibold">{skill.currentLevel}%</span>
                                    </span>
                                    <span className="text-muted">
                                        Benchmark: <span className="text-accent font-semibold">{skill.requiredLevel}%</span>
                                    </span>
                                </div>

                                {/* Double-layered visual indicator */}
                                <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-alt">
                                    {/* Target benchmark indicator line */}
                                    <div
                                        className="absolute top-0 bottom-0 z-10 w-0.5 bg-accent"
                                        style={{ left: `${skill.requiredLevel}%` }}
                                        title={`Benchmark: ${skill.requiredLevel}%`}
                                    />
                                    {/* Current proficiency bar */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${skill.severity === "critical"
                                                ? "bg-gradient-to-r from-rose-500 to-amber-500"
                                                : "bg-gradient-to-r from-accent to-accent-purple-light"
                                            }`}
                                        style={{ width: `${skill.currentLevel}%` }}
                                    />
                                </div>

                                <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted">
                                    <span className="flex items-center gap-1">
                                        {skill.gap > 15 ? (
                                            <AlertCircle size={12} className="text-rose-400" />
                                        ) : (
                                            <CheckCircle size={12} className="text-emerald-400" />
                                        )}
                                        Gap: {skill.gap}% delta
                                    </span>
                                    <span className="text-accent hover:underline cursor-pointer">
                                        View Targeted Questions →
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}