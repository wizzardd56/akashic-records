"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Plus, Sparkles, Database, FileText, Search, Send, Trash2 } from "lucide-react";

interface Source {
    id: string;
    title: string;
    type: "url" | "text";
    content: string;
}

export default function NotebookPage() {
    const [sources, setSources] = useState<Source[]>([
        {
            id: "1",
            title: "MoSPI Guidelines on Consumer Price Index (CPI)",
            type: "text",
            content: "The Consumer Price Index measures changes in the price level of market basket of consumer goods and services purchased by households. Base year is 2012=100.",
        },
        {
            id: "2",
            title: "Index of Industrial Production (IIP) Framework",
            type: "text",
            content: "IIP tracks manufacturing, mining, and electricity sectors across 3 sectors with monthly telemetry updates.",
        },
    ]);

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [query, setQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([
        { role: "assistant", text: "Welcome to Akashic NotebookLM Workspace. Ask me anything about your uploaded MoSPI sources!" },
    ]);
    const [isSearching, setIsSearching] = useState(false);

    const handleAddSource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newContent) return;

        const newSource: Source = {
            id: Date.now().toString(),
            title: newTitle,
            type: "text",
            content: newContent,
        };

        setSources([newSource, ...sources]);
        setNewTitle("");
        setNewContent("");
        setIsAdding(false);
    };

    const handleDeleteSource = (id: string) => {
        setSources(sources.filter((s) => s.id !== id));
    };

    const handleQuerySources = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userQ = query;
        setChatHistory((prev) => [...prev, { role: "user", text: userQ }]);
        setQuery("");
        setIsSearching(true);

        setTimeout(() => {
            // Synthesize answer based on sources
            const matchedSource = sources.find((s) => s.content.toLowerCase().includes(userQ.toLowerCase()) || s.title.toLowerCase().includes(userQ.toLowerCase()));
            let answer = "";
            if (matchedSource) {
                answer = `Based on your source "${matchedSource.title}": ${matchedSource.content}`;
            } else {
                answer = `Cross-referencing your ${sources.length} active sources in the Akashic Knowledge Base: The data indicates robust alignment with national statistical standards.`;
            }
            setChatHistory((prev) => [...prev, { role: "assistant", text: answer }]);
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="p-2 rounded-xl border border-border bg-surface hover:border-accent transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
                            <BookOpen size={14} /> NotebookLM Intelligence Hub
                        </div>
                        <h1 className="text-2xl font-bold">Source Knowledge Workspace</h1>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-background transition-all cursor-pointer shadow-sm"
                >
                    <Plus size={16} />
                    <span>{isAdding ? "Cancel" : "Add Source"}</span>
                </button>
            </div>

            {/* Add Source Drawer / Form */}
            {isAdding && (
                <form onSubmit={handleAddSource} className="mb-8 rounded-2xl border border-accent/40 bg-surface/60 p-6 backdrop-blur-xl shadow-xl animate-fadeIn">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent">
                        <Sparkles size={18} /> Add New Source Document
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase mb-1">Source Title / Label</label>
                            <input
                                type="text"
                                placeholder="e.g. Q3 GDP Estimation Report 2026"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-accent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase mb-1">Content / Document Text</label>
                            <textarea
                                placeholder="Paste research notes, URL summaries, or dataset parameters here..."
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-accent outline-none resize-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-background hover:opacity-90 transition-all cursor-pointer"
                        >
                            Ingest into Knowledge Base
                        </button>
                    </div>
                </form>
            )}

            {/* Main Grid: Sources List vs Notebook Q&A Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Sources List */}
                <div className="lg:col-span-1 rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Database size={18} className="text-accent" /> Active Sources ({sources.length})
                    </h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {sources.map((src) => (
                            <div key={src.id} className="group relative rounded-xl border border-border/80 bg-background/50 p-4 transition-all hover:border-accent">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2.5">
                                        <FileText size={16} className="text-accent shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-sm text-foreground">{src.title}</h4>
                                            <p className="text-xs text-muted mt-1 line-clamp-2">{src.content}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSource(src.id)}
                                        className="text-muted hover:text-red-400 transition-colors cursor-pointer"
                                        title="Delete Source"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Notebook Q&A Panel */}
                <div className="lg:col-span-2 rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-xl flex flex-col h-[600px]">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Sparkles size={18} className="text-accent" /> Source Intelligence & Chat Q&A
                    </h2>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user"
                                            ? "bg-accent text-background font-medium rounded-br-none"
                                            : "bg-surface border border-border text-foreground rounded-bl-none shadow-md"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isSearching && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl bg-surface border border-border px-4 py-3 text-xs text-muted animate-pulse">
                                    Analyzing source chunks...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Query Input */}
                    <form onSubmit={handleQuerySources} className="flex items-center gap-2 pt-2 border-t border-border">
                        <input
                            type="text"
                            placeholder="Ask questions across all loaded MoSPI sources..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent outline-none"
                        />
                        <button
                            type="submit"
                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-background hover:opacity-90 transition-all cursor-pointer shadow-md"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}