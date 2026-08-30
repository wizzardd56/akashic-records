"use client";

import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";

export function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleToggle = () => {
        setIsExpanded((prev) => {
            const next = !prev;
            if (next) {
                // Focus input after expansion animation
                setTimeout(() => inputRef.current?.focus(), 150);
            }
            return next;
        });
        if (isExpanded) setQuery("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        // TODO: Plug into global search module
        console.log("Search:", query);
    };

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="relative flex items-center"
        >
            <div
                className={clsx(
                    "flex items-center overflow-hidden rounded-md border transition-all duration-300",
                    isExpanded
                        ? "w-56 border-accent bg-surface sm:w-64"
                        : "w-10 border-transparent bg-transparent"
                )}
            >
                <button
                    type="button"
                    onClick={handleToggle}
                    className="flex h-10 w-10 shrink-0 items-center justify-center
                     text-muted transition-colors hover:text-foreground"
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
                        placeholder="Search Akashic Records..."
                        className="h-10 w-full bg-transparent pr-3 text-sm text-foreground
                       placeholder:text-muted focus:outline-none"
                        aria-label="Search the platform"
                    />
                )}
            </div>
        </form>
    );
}