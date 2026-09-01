"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Award,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Sparkles,
    ArrowRight,
    RotateCcw,
    X,
    Flame,
    Check,
    ShieldCheck,
} from "lucide-react";

export interface QuizQuestion {
    id: string;
    topic: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const OFFICIAL_STATISTICS_QUESTIONS: QuizQuestion[] = [
    {
        id: "q1",
        topic: "NSSO Sampling Methodologies",
        question:
            "In NSSO multi-stage stratified surveys (e.g., PLFS), how are rural Primary Sampling Units (PSUs/Villages) typically selected?",
        options: [
            "Simple Random Sampling Without Replacement (SRSWOR)",
            "Probability Proportional to Size with Replacement (PPSWR) based on Census population",
            "Circular Systematic Sampling with equal probabilities",
            "Stratified Cluster Purposive Sampling",
        ],
        correctIndex: 1,
        explanation:
            "Under MoSPI NSSO protocol, rural PSUs are selected using Probability Proportional to Size (PPS) where size is village population as per the latest Population Census.",
    },
    {
        id: "q2",
        topic: "Macroeconomic Price Indices (CPI)",
        question:
            "When compiling the Consumer Price Index (CPI), which method is officially adopted for elementary-level item price aggregation before group weighting?",
        options: [
            "Arithmetic Mean of price relatives (Carli Index)",
            "Geometric Mean of price relatives (Jevons Index)",
            "Harmonic Mean of prices",
            "Median price ratio selection",
        ],
        correctIndex: 1,
        explanation:
            "The Jevons Geometric Mean formula is officially standard to prevent upward index bias and satisfy the Time Reversal Test across elementary product varieties.",
    },
    {
        id: "q3",
        topic: "System of National Accounts (SNA 2008)",
        question:
            "Under India's National Accounts Statistics (NAS), what is the exact formula for Gross Value Added (GVA) at Basic Prices?",
        options: [
            "GVA = Output at Basic Prices - Intermediate Consumption",
            "GVA = GDP at Market Prices + Product Taxes - Subsidies",
            "GVA = Net Domestic Product - Consumption of Fixed Capital",
            "GVA = Total Final Consumption Expenditure + Gross Capital Formation",
        ],
        correctIndex: 0,
        explanation:
            "GVA at basic prices represents production value before product taxes and subsidies, calculated strictly as Output (at basic prices) minus Intermediate Consumption.",
    },
    {
        id: "q4",
        topic: "Survey Weighting & Multipliers",
        question:
            "What is the primary mathematical purpose of post-stratification survey weight calibration in official statistics?",
        options: [
            "To artificially inflate sample size for statistical power",
            "To eliminate the need for confidence intervals",
            "To adjust for unit non-response and align sample distributions with known Census control totals",
            "To convert ordinal survey responses into continuous variables",
        ],
        correctIndex: 2,
        explanation:
            "Calibration multipliers adjust inverse selection probabilities to match auxiliary population totals, minimizing non-response bias and variance.",
    },
];

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    onQuizCompleted: (scoreYield: number) => void;
}

export function QuizModal({ isOpen, onClose, onQuizCompleted }: QuizModalProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[]>(OFFICIAL_STATISTICS_QUESTIONS);

    // Shuffle questions every time modal opens
    useEffect(() => {
        if (isOpen) {
            setQuestions(shuffleArray(OFFICIAL_STATISTICS_QUESTIONS));
            setCurrentIdx(0);
            setSelectedOption(null);
            setIsAnswerSubmitted(false);
            setScore(0);
            setIsFinished(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const currentQ = questions[currentIdx];
    const isCorrect = selectedOption === currentQ.correctIndex;
    const progressPercent = ((currentIdx + 1) / questions.length) * 100;

    const handleSelectOption = (idx: number) => {
        if (isAnswerSubmitted) return;
        setSelectedOption(idx);
        setIsAnswerSubmitted(true);
        if (idx === currentQ.correctIndex) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentIdx + 1 < questions.length) {
            setCurrentIdx((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswerSubmitted(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleApplyYield = () => {
        const yieldBoost = Math.max(3, Math.round((score / questions.length) * 6.5));
        onQuizCompleted(yieldBoost);
        onClose();
    };

    const handleRestart = () => {
        setQuestions(shuffleArray(OFFICIAL_STATISTICS_QUESTIONS));
        setCurrentIdx(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setIsFinished(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-2xl border border-accent/40 bg-surface/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl dark:glow-cyan flex flex-col justify-between max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted hover:text-foreground text-lg font-bold p-1 cursor-pointer transition-colors"
                    aria-label="Close Assessment"
                >
                    <X size={20} />
                </button>

                {!isFinished ? (
                    <>
                        {/* Header & Progress */}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                                    <Flame size={12} />
                                    MoSPI Competency Assessment
                                </span>
                                <span className="text-xs text-muted">
                                    Question {currentIdx + 1} of {questions.length}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                                <div
                                    className="h-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-300 rounded-full"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>

                            {/* Topic & Question */}
                            <div className="mt-4">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                                    {currentQ.topic}
                                </span>
                                <h3 className="mt-1 text-base sm:text-lg font-bold text-foreground leading-snug">
                                    {currentQ.question}
                                </h3>
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="mt-6 space-y-3">
                            {currentQ.options.map((option, idx) => {
                                let btnStyle = "border-border bg-surface-alt/60 text-foreground hover:border-accent/60";

                                if (isAnswerSubmitted) {
                                    if (idx === currentQ.correctIndex) {
                                        btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold";
                                    } else if (selectedOption === idx) {
                                        btnStyle = "border-rose-500 bg-rose-500/20 text-rose-300";
                                    } else {
                                        btnStyle = "border-border/40 bg-surface-alt/30 text-muted opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={isAnswerSubmitted}
                                        onClick={() => handleSelectOption(idx)}
                                        className={`group w-full flex items-start gap-3 rounded-xl border p-4 text-left text-xs sm:text-sm transition-all duration-200 cursor-pointer ${btnStyle}`}
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xs font-bold text-muted group-hover:text-accent group-hover:border-accent">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="flex-1 mt-0.5">{option}</span>
                                        {isAnswerSubmitted && idx === currentQ.correctIndex && (
                                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                        )}
                                        {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                                            <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation Breakdown Banner */}
                        {isAnswerSubmitted && (
                            <div
                                className={`mt-4 rounded-xl border p-4 text-xs leading-relaxed ${isCorrect
                                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                        : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                                    }`}
                            >
                                <div className="flex items-center gap-1.5 font-bold mb-1">
                                    <HelpCircle size={14} />
                                    <span>{isCorrect ? "Official Standard Confirmed" : "Methodological Rationale"}</span>
                                </div>
                                <p>{currentQ.explanation}</p>
                            </div>
                        )}

                        {/* Footer Navigation */}
                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/70">
                            <span className="text-xs text-muted">
                                Score: <span className="text-accent font-bold">{score}</span> / {questions.length}
                            </span>

                            {isAnswerSubmitted && (
                                <button
                                    type="button"
                                    onClick={handleNextQuestion}
                                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-bold text-background transition-all hover:bg-accent-hover dark:glow-cyan cursor-pointer"
                                >
                                    <span>{currentIdx + 1 === questions.length ? "View Evaluation" : "Next Indicator"}</span>
                                    <ArrowRight size={15} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    /* Completion & Certification View */
                    <div className="text-center py-4 space-y-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 text-accent dark:glow-cyan">
                            <ShieldCheck size={36} />
                        </div>

                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                                Evaluation Complete
                            </span>
                            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">
                                Statistical Competency Validated
                            </h2>
                            <p className="mt-1 text-sm text-muted">
                                You scored <span className="text-accent font-bold">{score}</span> out of{" "}
                                <span className="font-bold text-foreground">{questions.length}</span> indicators
                                ({Math.round((score / questions.length) * 100)}%).
                            </p>
                        </div>

                        {/* Certified Badge Card */}
                        <div className="rounded-xl border border-accent/40 bg-surface-alt/70 p-5 text-left flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">
                                        {score >= 3 ? "MoSPI Sampling & Index Specialist" : "Official Statistics Associate"}
                                    </h4>
                                    <p className="text-xs text-muted">Micro-credential yield verified for SIH 26101</p>
                                </div>
                            </div>
                            <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 shrink-0">
                                +{Math.max(3, Math.round((score / questions.length) * 6.5))}% Yield
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleRestart}
                                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-alt px-5 py-3 text-xs sm:text-sm font-semibold text-foreground hover:border-accent transition-all cursor-pointer"
                            >
                                <RotateCcw size={15} />
                                <span>Retake Assessment</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleApplyYield}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs sm:text-sm font-bold text-background transition-all hover:bg-accent-hover dark:glow-cyan cursor-pointer"
                            >
                                <Sparkles size={16} />
                                <span>Apply Score Boost to Dashboard</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}