"use client";

import React, { useState, useEffect } from "react";
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
    ShieldCheck,
    Loader2,
} from "lucide-react";
import { useCourse, getCourseLabel } from "../../../shared/providers/CourseProvider";

export interface QuizQuestion {
    id: string;
    topic: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const FALLBACK_QUESTIONS: QuizQuestion[] = [
    {
        id: "q1", topic: "General Knowledge",
        question: "Which of the following best describes data science?",
        options: ["Extracting insights from structured and unstructured data", "Only writing computer programs", "Managing physical file storage"],
        correctIndex: 0,
        explanation: "Data science combines statistics, programming, and domain knowledge to extract actionable insights from data.",
    },
    {
        id: "q2", topic: "Programming Basics",
        question: "What does CPU stand for?",
        options: ["Central Processing Unit", "Computer Personal Utility", "Central Program Utility"],
        correctIndex: 0,
        explanation: "The CPU (Central Processing Unit) is the primary component that executes instructions in a computer.",
    },
    {
        id: "q3", topic: "Networking",
        question: "What does HTTP stand for?",
        options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Home Tool Transfer Protocol"],
        correctIndex: 0,
        explanation: "HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web.",
    },
    {
        id: "q4", topic: "Cybersecurity",
        question: "What is phishing?",
        options: ["A technique to catch fish underwater", "A social engineering attack to steal sensitive information", "A type of fishing equipment"],
        correctIndex: 1,
        explanation: "Phishing is a cyberattack where attackers impersonate legitimate entities to trick users into revealing sensitive data.",
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

function parseAIQuizText(text: string): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const blocks = text.split(/QUESTION:\s*/i).filter((b) => b.trim());
    for (const block of blocks) {
        const qMatch = block.match(/^(.+?)(?:\n|$)/);
        const optA = block.match(/OPTION A:\s*(.+?)(?:\n|$)/i);
        const optB = block.match(/OPTION B:\s*(.+?)(?:\n|$)/i);
        const optC = block.match(/OPTION C:\s*(.+?)(?:\n|$)/i);
        const correctMatch = block.match(/CORRECT:\s*([A-C])/i);
        const explMatch = block.match(/EXPLANATION:\s*(.+?)(?:\n|$)/i);
        if (qMatch && optA && optB && optC) {
            const correctMap: Record<string, number> = { A: 0, B: 1, C: 2 };
            questions.push({
                id: `ai-q-${questions.length + 1}`, topic: "AI Generated",
                question: qMatch[1].trim(),
                options: [optA[1].trim(), optB[1].trim(), optC[1].trim()],
                correctIndex: correctMap[(correctMatch?.[1] || "A").toUpperCase()] ?? 0,
                explanation: explMatch?.[1]?.trim() || "Based on the analyzed content.",
            });
        }
    }
    return questions;
}

function buildQuizPrompt(courseLabel: string): { prompt: string; sourceContent: string } {
    return {
        prompt: `Generate 4 challenging MCQs tailored for a ${courseLabel} student. Format each as:\nQUESTION: [text]\nOPTION A: [text]\nOPTION B: [text]\nOPTION C: [text]\nCORRECT: [A/B/C]\nEXPLANATION: [text]\nMake them progressively harder.`,
        sourceContent: `Student studies ${courseLabel}. Generate curriculum-appropriate questions.`,
    };
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
    const [questions, setQuestions] = useState<QuizQuestion[]>(FALLBACK_QUESTIONS);
    const [isLoading, setIsLoading] = useState(false);
    const { selectedCourse } = useCourse();

    useEffect(() => {
        if (!isOpen) return;
        setCurrentIdx(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setIsFinished(false);
        setIsLoading(true);
        const courseLabel = getCourseLabel(selectedCourse);
        const { prompt, sourceContent } = buildQuizPrompt(courseLabel);
        fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "quiz", courseId: selectedCourse, prompt, sourceContent }),
        })
            .then((r) => r.json())
            .then((data) => {
                const parsed = parseAIQuizText(data.reply || "");
                setQuestions(parsed.length >= 3 ? shuffleArray(parsed) : shuffleArray(FALLBACK_QUESTIONS));
            })
            .catch(() => setQuestions(shuffleArray(FALLBACK_QUESTIONS)))
            .finally(() => setIsLoading(false));
    }, [isOpen, selectedCourse]);

    if (!isOpen) return null;

    const currentQ = questions[currentIdx];
    const isCorrect = selectedOption === currentQ?.correctIndex;
    const progressPercent = ((currentIdx + 1) / questions.length) * 100;

    const handleSelectOption = (idx: number) => {
        if (isAnswerSubmitted) return;
        setSelectedOption(idx);
        setIsAnswerSubmitted(true);
        if (idx === currentQ.correctIndex) setScore((prev) => prev + 1);
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
        onQuizCompleted(Math.max(3, Math.round((score / questions.length) * 6.5)));
        onClose();
    };

    const fetchNewQuestions = () => {
        setIsLoading(true);
        setCurrentIdx(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setIsFinished(false);
        const courseLabel = getCourseLabel(selectedCourse);
        const { prompt, sourceContent } = buildQuizPrompt(courseLabel);
        fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "quiz", courseId: selectedCourse, prompt, sourceContent }),
        })
            .then((r) => r.json())
            .then((data) => {
                const parsed = parseAIQuizText(data.reply || "");
                setQuestions(parsed.length >= 3 ? shuffleArray(parsed) : shuffleArray(FALLBACK_QUESTIONS));
            })
            .catch(() => setQuestions(shuffleArray(FALLBACK_QUESTIONS)))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-2xl border border-accent/40 bg-surface/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl dark:glow-cyan flex flex-col justify-between max-h-[90vh] overflow-y-auto">
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground p-1 cursor-pointer" aria-label="Close Assessment">
                    <X size={20} />
                </button>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <Loader2 size={40} className="animate-spin text-accent" />
                        <p className="text-sm text-muted">Generating AI quiz for <span className="text-accent font-bold">{getCourseLabel(selectedCourse)}</span>...</p>
                    </div>
                ) : !isFinished ? (
                    <>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                                    <Flame size={12} />{getCourseLabel(selectedCourse)} Assessment
                                </span>
                                <span className="text-xs text-muted">Question {currentIdx + 1} of {questions.length}</span>
                            </div>
                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                                <div className="h-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-300 rounded-full" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <div className="mt-4">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">{currentQ.topic}</span>
                                <h3 className="mt-1 text-base sm:text-lg font-bold text-foreground leading-snug">{currentQ.question}</h3>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {currentQ.options.map((option, idx) => {
                                let btnStyle = "border-border bg-surface-alt/60 text-foreground hover:border-accent/60";
                                if (isAnswerSubmitted) {
                                    if (idx === currentQ.correctIndex) btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold";
                                    else if (selectedOption === idx) btnStyle = "border-rose-500 bg-rose-500/20 text-rose-300";
                                    else btnStyle = "border-border/40 bg-surface-alt/30 text-muted opacity-50";
                                }
                                return (
                                    <button key={idx} type="button" disabled={isAnswerSubmitted} onClick={() => handleSelectOption(idx)}
                                        className={`group w-full flex items-start gap-3 rounded-xl border p-4 text-left text-xs sm:text-sm transition-all duration-200 cursor-pointer ${btnStyle}`}>
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xs font-bold text-muted group-hover:text-accent group-hover:border-accent">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="flex-1 mt-0.5">{option}</span>
                                        {isAnswerSubmitted && idx === currentQ.correctIndex && <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
                                        {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswerSubmitted && (
                            <div className={`mt-4 rounded-xl border p-4 text-xs leading-relaxed ${isCorrect ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
                                <div className="flex items-center gap-1.5 font-bold mb-1"><HelpCircle size={14} /><span>{isCorrect ? "Correct!" : "Not quite"}</span></div>
                                <p>{currentQ.explanation}</p>
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/70">
                            <span className="text-xs text-muted">Score: <span className="text-accent font-bold">{score}</span> / {questions.length}</span>
                            {isAnswerSubmitted && (
                                <button type="button" onClick={handleNextQuestion}
                                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-bold text-background transition-all hover:bg-accent-hover dark:glow-cyan cursor-pointer">
                                    <span>{currentIdx + 1 === questions.length ? "View Results" : "Next Question"}</span>
                                    <ArrowRight size={15} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4 space-y-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 text-accent dark:glow-cyan">
                            <ShieldCheck size={36} />
                        </div>
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Assessment Complete</span>
                            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">Competency Validated</h2>
                            <p className="mt-1 text-sm text-muted">
                                You scored <span className="text-accent font-bold">{score}</span> out of <span className="font-bold text-foreground">{questions.length}</span> questions ({Math.round((score / questions.length) * 100)}%).
                            </p>
                        </div>
                        <div className="rounded-xl border border-accent/40 bg-surface-alt/70 p-5 text-left flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300"><Award size={24} /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">{getCourseLabel(selectedCourse)} Proficiency Badge</h4>
                                    <p className="text-xs text-muted">AI-generated assessment for your curriculum</p>
                                </div>
                            </div>
                            <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 shrink-0">
                                +{Math.max(3, Math.round((score / questions.length) * 6.5))}% Yield
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="button" onClick={fetchNewQuestions}
                                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-alt px-5 py-3 text-xs sm:text-sm font-semibold text-foreground hover:border-accent transition-all cursor-pointer">
                                <RotateCcw size={15} /><span>New Questions</span>
                            </button>
                            <button type="button" onClick={handleApplyYield}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs sm:text-sm font-bold text-background transition-all hover:bg-accent-hover dark:glow-cyan cursor-pointer">
                                <Sparkles size={16} /><span>Apply Score to Dashboard</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
