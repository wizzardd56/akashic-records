"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Bot,
    Sparkles,
    Send,
    X,
    RefreshCw,
    Zap,
    BookOpen,
    Layers,
    User,
    CornerDownLeft,
    ChevronRight,
    Flame,
} from "lucide-react";

interface Message {
    id: string;
    sender: "ai" | "user";
    text: string;
    timestamp: string;
    recommendations?: { label: string; action: string; isQuiz?: boolean }[];
}

interface AICopilotDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenQuiz?: () => void;
}

const QUICK_PROMPTS = [
    "How do I resolve my CPI / IIP calculation gap?",
    "Explain NSSO sample weight calibration",
    "Launch MoSPI Practice Assessment",
    "Recommend iGOT modules for GVA modeling",
];

const INITIAL_MESSAGES: Message[] = [
    {
        id: "msg-1",
        sender: "ai",
        text: "Greetings, Officer. I am your Akashic Statistical Copilot calibrated for India's Official Statistical System (SIH 26101). How can I assist with your competency milestones or survey methodologies today?",
        timestamp: "Just now",
        recommendations: [
            { label: "Launch Practice Assessment", action: "Launch MoSPI Practice Assessment", isQuiz: true },
            { label: "Review CPI Gap Plan", action: "How do I resolve my CPI / IIP calculation gap?" },
        ],
    },
];

export function AICopilotDrawer({ isOpen, onClose, onOpenQuiz }: AICopilotDrawerProps) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const generateAIResponse = (userQuery: string): Message => {
        const lower = userQuery.toLowerCase();
        let replyText = "";
        let recs: { label: string; action: string; isQuiz?: boolean }[] | undefined = undefined;

        if (lower.includes("quiz") || lower.includes("assessment") || lower.includes("practice")) {
            replyText =
                "Launching the interactive MoSPI Assessment Engine. You will be evaluated on NSSO multi-stage sampling, CPI Jevons index aggregation, and SNA 2008 GVA modeling. Click below to initiate the test session.";
            recs = [
                { label: "Start Assessment Now", action: "OPEN_QUIZ_MODAL", isQuiz: true },
            ];
        } else if (lower.includes("cpi") || lower.includes("iip") || lower.includes("price")) {
            replyText =
                "Your current gap in Macroeconomic Price Indices is 31%. For MoSPI compliance, focus on: (1) Geometric Mean Aggregation at elementary levels, (2) Modified Laspeyres formulation for IIP item weighting, and (3) Hedonic quality adjustments. Complete 'Advanced IIP & Price Index Protocols' on iGOT to gain +15% readiness.";
            recs = [
                { label: "Take CPI/IIP Quiz", action: "Launch MoSPI Practice Assessment", isQuiz: true },
            ];
        } else if (lower.includes("nsso") || lower.includes("sampling") || lower.includes("weight")) {
            replyText =
                "In NSSO multi-stage stratified sampling: Primary Sampling Units (PSUs) use PPS (Probability Proportional to Size), while Ultimate Sampling Units (Households) use Circular Systematic Sampling. Multipliers (weights) equal Inverse Selection Probability adjusted for non-response.";
            recs = [
                { label: "Test Sampling MCQs", action: "Launch MoSPI Practice Assessment", isQuiz: true },
            ];
        } else if (lower.includes("gva") || lower.includes("national accounts") || lower.includes("sna")) {
            replyText =
                "Under SNA 2008 & India NAS, Gross Value Added (GVA) at Basic Prices = Output at basic prices minus Intermediate Consumption. The key challenge is estimating the unorganized non-financial sector using Enterprise Survey (ASI/NSS) blow-up factors.";
            recs = [
                { label: "Assess GVA Knowledge", action: "Launch MoSPI Practice Assessment", isQuiz: true },
            ];
        } else {
            replyText = `Analyzing "${userQuery}" against MoSPI competency standards. Based on your skill matrix, completing milestone step 2 will bridge your largest telemetry gap. Would you like a targeted practice quiz?`;
            recs = [
                { label: "Launch Practice Quiz", action: "Launch MoSPI Practice Assessment", isQuiz: true },
            ];
        }

        return {
            id: `msg-${Date.now()}`,
            sender: "ai",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            recommendations: recs,
        };
    };

    const handleSend = (textToSend?: string) => {
        const query = textToSend || inputValue;
        if (!query.trim()) return;

        // Direct trigger for quiz
        if (query === "OPEN_QUIZ_MODAL" || query === "Launch MoSPI Practice Assessment") {
            if (onOpenQuiz) {
                onClose();
                onOpenQuiz();
                return;
            }
        }

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            const aiReply = generateAIResponse(query);
            setMessages((prev) => [...prev, aiReply]);
            setIsTyping(false);
        }, 700);
    };

    const handleResetChat = () => {
        setMessages(INITIAL_MESSAGES);
        setIsTyping(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over Drawer */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="w-screen max-w-md border-l border-border bg-surface/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between dark:glow-cyan">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border p-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent dark:glow-cyan">
                                <Bot size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-foreground">Akashic Copilot</h3>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Online
                                    </span>
                                </div>
                                <p className="text-xs text-muted">MoSPI Statistical Knowledge Engine</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleResetChat}
                                className="rounded-lg p-2 text-muted hover:bg-surface-alt hover:text-foreground transition-colors cursor-pointer"
                                title="Reset Conversation"
                            >
                                <RefreshCw size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-2 text-muted hover:bg-surface-alt hover:text-foreground transition-colors cursor-pointer"
                                title="Close Drawer (Esc)"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Prompts Bar */}
                    <div className="border-b border-border/60 bg-background/50 p-3 overflow-x-auto no-scrollbar">
                        <div className="flex gap-2">
                            {QUICK_PROMPTS.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSend(prompt)}
                                    className="shrink-0 rounded-lg border border-border bg-surface/80 px-2.5 py-1 text-xs text-muted transition-all hover:border-accent hover:text-accent hover:bg-surface cursor-pointer"
                                >
                                    <Zap size={11} className="inline mr-1 text-accent" />
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Thread */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.sender === "ai" && (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                                        <Bot size={15} />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${msg.sender === "user"
                                            ? "bg-accent text-background font-medium rounded-tr-xs"
                                            : "bg-surface-alt/90 border border-border/70 text-foreground rounded-tl-xs"
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <span
                                        className={`block mt-1.5 text-[10px] ${msg.sender === "user" ? "text-background/75" : "text-muted"
                                            }`}
                                    >
                                        {msg.timestamp}
                                    </span>

                                    {/* Recommendation action pills */}
                                    {msg.recommendations && msg.recommendations.length > 0 && (
                                        <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1.5">
                                            <span className="text-[10px] uppercase font-semibold text-muted tracking-wider block">
                                                Suggested Actions:
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {msg.recommendations.map((rec, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => {
                                                            if (rec.isQuiz && onOpenQuiz) {
                                                                onClose();
                                                                onOpenQuiz();
                                                            } else {
                                                                handleSend(rec.action);
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent hover:text-background cursor-pointer"
                                                    >
                                                        <Sparkles size={11} />
                                                        <span>{rec.label}</span>
                                                        <ChevronRight size={11} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.sender === "user" && (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface border border-border text-muted">
                                        <User size={15} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 justify-start items-center">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                                    <Bot size={15} />
                                </div>
                                <div className="rounded-2xl rounded-tl-xs border border-border/70 bg-surface-alt/90 px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Footer */}
                    <div className="border-t border-border p-4 sm:p-5 bg-surface/70 backdrop-blur-md">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="relative flex items-center"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about sampling, CPI, or take a quiz..."
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-20 text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="absolute right-1.5 flex h-9 items-center gap-1 rounded-lg bg-accent px-3 text-xs font-bold text-background transition-all hover:bg-accent-hover disabled:opacity-40 cursor-pointer"
                            >
                                <span>Send</span>
                                <CornerDownLeft size={13} />
                            </button>
                        </form>
                        <p className="mt-2 text-[10px] text-center text-muted">
                            Trained on MoSPI survey protocols, National Accounts, & iGOT taxonomy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}