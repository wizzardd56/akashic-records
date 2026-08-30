import React from "react";

interface LogoProps {
    className?: string;
    size?: number;
}

/**
 * SVG Neural Network logo mark for Akashic Records.
 * Inline SVG so it inherits currentColor and renders instantly (no network request).
 */
export function Logo({ className = "", size = 32 }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true" /* Decorative — text label handles semantics */
        >
            {/* Connection lines */}
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
                <line x1="24" y1="8" x2="10" y2="20" />
                <line x1="24" y1="8" x2="38" y2="20" />
                <line x1="10" y1="20" x2="10" y2="34" />
                <line x1="38" y1="20" x2="38" y2="34" />
                <line x1="10" y1="34" x2="24" y2="42" />
                <line x1="38" y1="34" x2="24" y2="42" />
                <line x1="10" y1="20" x2="24" y2="26" />
                <line x1="38" y1="20" x2="24" y2="26" />
                <line x1="24" y1="26" x2="10" y2="34" />
                <line x1="24" y1="26" x2="38" y2="34" />
                <line x1="24" y1="8" x2="24" y2="26" />
                <line x1="24" y1="26" x2="24" y2="42" />
            </g>

            {/* Nodes — outer ring */}
            <circle cx="24" cy="8" r="4" fill="currentColor" opacity="0.9" />
            <circle cx="10" cy="20" r="3.5" fill="currentColor" opacity="0.8" />
            <circle cx="38" cy="20" r="3.5" fill="currentColor" opacity="0.8" />
            <circle cx="10" cy="34" r="3.5" fill="currentColor" opacity="0.8" />
            <circle cx="38" cy="34" r="3.5" fill="currentColor" opacity="0.8" />
            <circle cx="24" cy="42" r="4" fill="currentColor" opacity="0.9" />

            {/* Central node — brighter */}
            <circle cx="24" cy="26" r="5" fill="currentColor" />
            <circle cx="24" cy="26" r="2.5" fill="var(--color-background, #0a0a0f)" />
        </svg>
    );
}