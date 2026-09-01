"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, LayoutDashboard, BookOpen, Award, Bot } from "lucide-react";

interface SearchResult {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    keywords: string[];
}

const SEARCH_INDEX: SearchResult[] = [
    {
        title: "Dashboard",
        description: "Neural Skill Intelligence Hub - view scores, gaps & progress",
        href: "/dashboard",
        icon: <LayoutDashboard size={16} />,
        keywords: ["dashboard", "home", "scores", "competency", "gaps", "progress", "hub"],
    },
    {
        title: "AI Chatbox",
        description: "Source Knowledge Workspace - upload docs, chat & generate quizzes",
        href: "/notebook",
        icon: <BookOpen size={16} />,
        keywords: ["notebook", "chatbox", "ai", "upload", "document", "source", "quiz", "knowledge", "workspace", "chat"],
    },
    {
        title: "Take Assessment",
        description: "AI-powered competency quiz - test your knowledge",
        href: "/dashboard",
        icon: <Award size={16} />,
        keywords: ["quiz", "assessment", "test", "exam", "evaluation", "score", "practice"],
    },
    {
        title: "AI Copilot",
        description: "Ask questions about statistics, sampling & MoSPI protocols",
        href: "/dashboard",
        icon: <Bot size={16} />,
        keywords: ["copilot", "assistant", "help", "ask", "ai", "statistics", "nsso", "cpi", "gva"],
    },
];

export function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase();
        const matched = SEARCH_INDEX.filter((item) =>
            item.keywords.some((kw) => kw.includes(q)) ||
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        );
        setResults(matched);
    }, [query]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
                setQuery("");
            }
        }
        if (isExpanded) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isExpanded]);

    const handleToggle = () => {
        setIsExpanded((prev) => {
            if (!prev) {
                setTimeout(() => inputRef.current?.focus(), 150);
            }
            return !prev;
        });
        if (isExpanded) setQuery("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (results.length > 0) {
            window.location.href = results[0].href;
        } else if (query.trim()) {
            window.location.href = "/dashboard";
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <form onSubmit={handleSubmit} role="search" className="relative flex items-center">
                <div
                    className={`flex items-center overflow-hidden rounded-xl border transition-all duration-300 ${
                        isExpanded
                            ? "w-full border-white/20 bg-white/10 backdrop-blur-xl"
                            : "w-10 border-transparent bg-transparent"
                    }`}
                >
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="flex h-10 w-10 shrink-0 items-center justify-center text-white/50 transition-colors hover:text-white"
                        aria-label={isExpanded ? "Close search" : "Open search"}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? <X size={18} /> : <Search size={18} />}
                    </button>

                    {isExpanded && (
                        <input
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search pages... (e.g. dashboard, quiz, chatbox)"
                            className="h-10 w-full bg-transparent pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                            aria-label="Search the platform"
                        />
                    )}
                </div>
            </form>

            {isExpanded && query.trim() && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] rounded-xl border border-white/10 bg-[#111118]/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-fadeIn z-50">
                    {results.length > 0 ? (
                        <div className="p-2">
                            {results.map((result, idx) => (
                                <a
                                    key={idx}
                                    href={result.href}
                                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/8 group"
                                >
                                    <div className="mt-0.5 text-cyan-400 group-hover:text-cyan-300">
                                        {result.icon}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                            {result.title}
                                        </div>
                                        <div className="text-[11px] text-white/40 mt-0.5">
                                            {result.description}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center">
                            <p className="text-xs text-white/30">No results found</p>
                            <p className="text-[10px] text-white/20 mt-1">Try: dashboard, quiz, chatbox, copilot</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
