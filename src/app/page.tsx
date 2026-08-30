"use client";
import { useState } from "react";
import { HeroScene } from "../three/scenes/HeroScene";
import { AuthModal } from "../shared/components/AuthModal";

/**
 * Landing / Hero Page
 *
 * The 3D neural network scene renders as a full-viewport background.
 * Text and CTA are layered on top with proper z-indexing.
 */
export default function HomePage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4">
      {/* 3D Background — absolutely positioned behind content */}
      <HeroScene />

      {/* Gradient overlay to ensure text readability */}
      <div
        className="pointer-events-none absolute inset-0 -z-[5]
                    bg-gradient-to-b from-background/60 via-background/30 to-background/80
                    dark:from-background/40 dark:via-transparent dark:to-background/60"
        aria-hidden="true"
      />

      {/* Hero content — on top of the 3D scene */}
      <div className="relative z-10 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="text-foreground">Welcome to </span>
          <br className="sm:hidden" />
          <span className="text-accent dark:text-glow-cyan">
            Akashic Records
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-base text-muted sm:text-lg md:text-xl">
          AI-powered Skill Intelligence Platform for India&apos;s Official
          Statistical System. Identify competency gaps, get personalized learning paths, and
          master your domain.
        </p>

        {/* CTA — triggers Auth Modal */}
        <button
          type="button"
          onClick={() => openAuth("signup")}
          className="group relative inline-flex h-12 items-center justify-center
                     rounded-lg bg-accent px-8 text-base font-semibold
                     text-background transition-all duration-300
                     hover:bg-accent-hover hover:shadow-lg
                     dark:glow-cyan dark:hover:shadow-accent-bright/20
                     focus-visible:outline-2 focus-visible:outline-offset-2
                     focus-visible:outline-accent cursor-pointer"
        >
          GET STARTED
          <span
            className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </button>

        <p className="mt-6 text-sm text-muted/70">
          No account required to explore • Built for SIH 26101
        </p>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}