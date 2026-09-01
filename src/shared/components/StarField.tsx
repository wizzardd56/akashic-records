"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Palette } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Pre-generate static star positions once (avoids hydration mismatch) */
/* ------------------------------------------------------------------ */
const STAR_COUNT = 200;
const staticStars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.6 + 0.2,
  animDelay: Math.random() * 5,
  animDuration: Math.random() * 3 + 2,
}));

/* ------------------------------------------------------------------ */
/*  Shooting star configuration                                        */
/* ------------------------------------------------------------------ */
interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  speed: number;
}

const SHOOTING_STAR_POOL: ShootingStar[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  startX: Math.random() * 120 - 10,
  startY: Math.random() * 60 - 5,
  angle: Math.random() * 30 + 15,
  length: Math.random() * 120 + 80,
  speed: Math.random() * 1.2 + 0.8,
}));

/* ------------------------------------------------------------------ */
/*  Color presets                                                       */
/* ------------------------------------------------------------------ */
const COLOR_PRESETS = [
  { name: "Cyan", value: "#00f0ff" },
  { name: "Purple", value: "#a78bfa" },
  { name: "Gold", value: "#fbbf24" },
  { name: "Rose", value: "#fb7185" },
  { name: "Emerald", value: "#34d399" },
  { name: "White", value: "#e2e8f0" },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function StarField({ starColor: externalColor }: { starColor?: string }) {
  const [starColor, setStarColor] = useState(externalColor || "#00f0ff");
  const [showPicker, setShowPicker] = useState(false);
  const [activeShootingStars, setActiveShootingStars] = useState<ShootingStar[]>([]);
  const poolRef = useRef([...SHOOTING_STAR_POOL]);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync with external color if provided
  useEffect(() => {
    if (externalColor) setStarColor(externalColor);
  }, [externalColor]);

  // Launch shooting stars at random intervals
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = poolRef.current;
      if (pool.length === 0) {
        poolRef.current = [...SHOOTING_STAR_POOL];
        return;
      }
      const star = pool.shift()!;
      setActiveShootingStars((prev) => [...prev, star]);
      // Remove after animation completes
      setTimeout(() => {
        setActiveShootingStars((prev) => prev.filter((s) => s.id !== star.id));
        poolRef.current.push({ ...star, startX: Math.random() * 120 - 10, startY: Math.random() * 60 - 5 });
      }, (star.speed + 0.5) * 1000);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  // Close picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    if (showPicker) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  const hexToRgba = useCallback((hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }, []);

  return (
    <>
      {/* ---- Star Field Layer ---- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050f] via-[#0a0a1a] to-[#0d0d24]" />

        {/* Subtle nebula glow */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
          style={{ background: `radial-gradient(circle, ${hexToRgba(starColor, 0.25)}, transparent 70%)` }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-15"
          style={{ background: `radial-gradient(circle, ${hexToRgba(starColor, 0.15)}, transparent 70%)` }}
        />

        {/* Static stars */}
        {staticStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full star-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              backgroundColor: star.size > 1.8 ? starColor : "#e2e8f0",
              animationDelay: `${star.animDelay}s`,
              animationDuration: `${star.animDuration}s`,
              boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px ${hexToRgba(starColor, 0.4)}` : "none",
            }}
          />
        ))}

        {/* Shooting stars */}
        {activeShootingStars.map((star) => (
          <div
            key={`shoot-${star.id}`}
            className="shooting-star"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: `${star.length}px`,
              height: "1.5px",
              transform: `rotate(${star.angle}deg)`,
              background: `linear-gradient(90deg, ${hexToRgba(starColor, 0)}, ${hexToRgba(starColor, 0.6)}, ${starColor})`,
              animationDuration: `${star.speed}s`,
            }}
          />
        ))}
      </div>

      {/* ---- Color Picker (Bottom Left) ---- */}
      <div className="fixed bottom-6 left-6 z-50" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-3 py-2.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-lg"
          title="Change star color"
        >
          <Palette size={14} />
          <span className="hidden sm:inline">Theme</span>
        </button>

        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 p-3 rounded-2xl border border-white/10 bg-[#111118]/95 backdrop-blur-2xl shadow-2xl animate-fadeIn min-w-[180px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2.5">Star Color</p>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setStarColor(preset.value);
                    setShowPicker(false);
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all cursor-pointer ${
                    starColor === preset.value
                      ? "bg-white/15 ring-2"
                      : "hover:bg-white/8"
                  }`}
                  style={starColor === preset.value ? { boxShadow: `0 0 0 2px ${preset.value}` } : {}}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                    style={{
                      backgroundColor: preset.value,
                      boxShadow: `0 0 10px ${hexToRgba(preset.value, 0.5)}`,
                    }}
                  />
                  <span className="text-[9px] text-white/60 font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
            {/* Custom color input */}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="color"
                value={starColor}
                onChange={(e) => setStarColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[10px] text-white/40 font-mono uppercase">{starColor}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StarField;
