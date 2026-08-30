"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    Trash2,
    FileText,
    Sparkles,
    BrainCircuit,
    Send,
    Award,
    CheckCircle2,
    Upload,
    X
} from "lucide-react";

interface Source {
    id: string;
    title: string;
    content: string;
    summary: string;
}

export default function NotebookPage() {
    const [sources, setSources] = useState<Source[]>([
        {
            id: "1",
            title: "MoSPI Guidelines on Consumer Price Index (CPI)",
            content: "The Consumer Price Index measures changes in the price level of market basket of consumer goods and services purchased by households. Base year is 2012.",
            summary: "Covers retail inflation tracking, item baskets, weighting diagrams, and Jevons geometric mean formulas used across rural and urban sectors."
        },
        {
            id: "2",
            title: "Index of Industrial Production (IIF) Framework",
            content: "IIP tracks manufacturing, mining, and electricity sectors across 3 sectors with monthly telemetry updates.",
            summary: "A short-term indicator of industrial growth compiled monthly using data from source agencies like DIPP, CEA, and mineral bureaus."
        }
    ]);

    const [activeSourceId, setActiveSourceId] = useState<string>("1");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [chatQuery, setChatQuery] = useState("");
    const [chatLog, setChatLog] = useState<{ role: "user" | "ai"; text: string }[]>([
        { role: "ai", text: "Welcome to Akashic NotebookLM Workspace. Ask me anything or upload your study material to analyze and generate quizzes!" }
    ]);
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [quizScore, setQuizScore] = useState<number | null>(null);

    const activeSource = sources.find((s) => s.id === activeSourceId) || sources[0];

    // Handle File / Text Upload
    const handleAddSource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newContent) return;

        const generatedSummary = `AI Summary: ${newContent.slice(0, 150)}... [Analyzed & indexed successfully for Q&A and quiz generation].`;
        const newSrc: Source = {
            id: Date.now().toString(),
            title: newTitle,
            content: newContent,
            summary: generatedSummary
        };

        setSources([newSrc, ...sources]);
        setActiveSourceId(newSrc.id);
        setNewTitle("");
        setNewContent("");
        setIsUploadModalOpen(false);
    };

    const handleDeleteSource = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const filtered = sources.filter(s => s.id !== id);
        setSources(filtered);
        if (activeSourceId === id && filtered.length > 0) {
            setActiveSourceId(filtered[0].id);
        }
    };

    // Handle Chat Q&A over Active Source
    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatQuery.trim()) return;

        const userMsg = chatQuery;
        setChatQuery("");
        setChatLog(prev => [...prev, { role: "user", text: userMsg }]);

        setTimeout(() => {
            let aiReply = `Based on your loaded source "${activeSource?.title}", here is what you need to know: ${activeSource?.content.slice(0, 200)}... This directly answers your query regarding "${userMsg}".`;
            if (userMsg.toLowerCase().includes("summary")) {
                aiReply = `Summary of "${activeSource?.title}": ${activeSource?.summary}`;
            }
            setChatLog(prev => [...prev, { role: "ai", text: aiReply }]);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 flex flex-col relative">
            {/* Top Navigation & Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/50 px-3.5 py-2 text-xs font-semibold hover:border-accent transition-all cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        <span>Dashboard</span>
                    </Link>
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>NotebookLM Intelligence Hub</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Source Knowledge Workspace</h1>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-background transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/30 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>+ Add Source</span>
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Left Column: Active Sources List */}
                <div className="rounded-2xl border border-border bg-surface/30 p-5 flex flex-col gap-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                            Active Sources ({sources.length})
                        </h3>
                        <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full font-semibold">
                            AI Indexed
                        </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                        {sources.map((src) => (
                            <div
                                key={src.id}
                                onClick={() => setActiveSourceId(src.id)}
                                className={`group relative rounded-xl border p-4 text-left transition-all cursor-pointer ${activeSourceId === src.id
                                        ? "border-accent bg-accent/10 shadow-md shadow-accent/5"
                                        : "border-border bg-background/50 hover:border-accent/50 hover:bg-surface/60"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-accent shrink-0" />
                                        <h4 className="font-bold text-xs text-foreground line-clamp-1">{src.title}</h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteSource(src.id, e)}
                                        className="text-muted hover:text-red-400 transition-colors p-1 cursor-pointer"
                                        title="Delete source"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted mt-2 line-clamp-2">{src.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Source Summary, Chat Q&A & Quiz Generator */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Source Summary & Quick Quiz Trigger Card */}
                    <div className="rounded-2xl border border-accent/30 bg-surface/40 p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                            <BrainCircuit size={120} className="text-accent" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded-full">
                            Active Document Analysis
                        </span>
                        <h2 className="text-xl font-bold mt-2 text-foreground">{activeSource?.title}</h2>
                        <p className="text-xs text-muted mt-2 leading-relaxed bg-background/50 p-3.5 rounded-xl border border-border">
                            <strong className="text-accent">AI Summary: </strong>{activeSource?.summary}
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setQuizModalOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-purple-500/20 border border-purple-500/40 px-4 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-600 hover:text-white transition-all cursor-pointer shadow-md"
                            >
                                <Award size={16} />
                                <span>Generate Quiz from Source</span>
                            </button>
                        </div>
                    </div>

                    {/* Chat Q&A Box */}
                    <div className="rounded-2xl border border-border bg-surface/30 p-6 flex flex-col flex-1 backdrop-blur-xl min-h-[350px]">
                        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                            <BrainCircuit size={18} className="text-accent" />
                            <span>Source Intelligence & Chat Q&A</span>
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[300px] pr-2">
                            {chatLog.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.role === "user"
                                                ? "bg-accent text-background font-semibold"
                                                : "bg-background/80 border border-border text-foreground"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendChat} className="flex gap-2">
                            <input
                                type="text"
                                placeholder={`Ask questions about "${activeSource?.title}"...`}
                                value={chatQuery}
                                onChange={(e) => setChatQuery(e.target.value)}
                                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-xs text-foreground focus:border-accent outline-none"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-accent px-5 py-3 text-background font-bold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center shadow-md"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="relative w-full max-w-lg rounded-3xl border border-accent/40 bg-surface/90 p-8 shadow-2xl backdrop-blur-2xl">
                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute top-5 right-5 text-muted hover:text-foreground cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold tracking-tight mb-2">Upload Study Material or Document</h2>
                        <p className="text-xs text-muted mb-6">Paste your document text or study notes to instantly index, summarize, and generate quizzes.</p>

                        <form onSubmit={handleAddSource} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted mb-1">Document Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. National Income Statistics & GVA Report"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-accent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted mb-1">Document Content / Study Notes</label>
                                <textarea
                                    rows={6}
                                    placeholder="Paste study material, notes, or policy guidelines here..."
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-background p-4 text-xs text-foreground focus:border-accent outline-none resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-accent py-3 text-xs font-bold text-background hover:opacity-90 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                            >
                                <Upload size={16} />
                                <span>Index & Analyze Source</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Instant Quiz Modal Generated from Source */}
            {quizModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="relative w-full max-w-md rounded-3xl border border-purple-500/40 bg-surface/90 p-8 shadow-2xl backdrop-blur-2xl text-center">
                        <button
                            type="button"
                            onClick={() => { setQuizModalOpen(false); setQuizScore(null); }}
                            className="absolute top-5 right-5 text-muted hover:text-foreground cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 text-purple-300 mb-3">
                            <Award size={28} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">AI Generated Source Quiz</h2>
                        <p className="text-xs text-muted mt-1">Based on: <span className="text-accent font-semibold">{activeSource?.title}</span></p>

                        {quizScore === null ? (
                            <div className="mt-6 text-left space-y-4">
                                <p className="text-xs font-semibold text-foreground">
                                    Q: What is the core focus / base indicator benchmark outlined in this source document?
                                </p>
                                <div className="space-y-2">
                                    {[
                                        "Macroeconomic price indexing and telemetry compilation",
                                        "Random sampling without demographic metrics",
                                        "Manual ledger entry without baseline standards"
                                    ].map((opt, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setQuizScore(idx === 0 ? 100 : 40)}
                                            className="w-full text-left rounded-xl border border-border bg-background p-3 text-xs font-medium hover:border-accent transition-all cursor-pointer"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4 py-4">
                                <div className="text-3xl font-bold text-emerald-400">Score: {quizScore}%</div>
                                <p className="text-xs text-muted">Quiz completed successfully! Your competency score has been updated based on this source material.</p>
                                <button
                                    type="button"
                                    onClick={() => { setQuizModalOpen(false); setQuizScore(null); }}
                                    className="rounded-xl bg-accent px-6 py-2.5 text-xs font-bold text-background cursor-pointer"
                                >
                                    Close & Return
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}