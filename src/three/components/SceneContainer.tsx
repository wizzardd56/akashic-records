"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { NeuralParticles } from "./NeuralParticles";
import { NeuralConnections } from "./NeuralConnections";

/**
 * Inner scene contents — separated so Suspense works correctly.
 */
function SceneContents() {
    return (
        <group rotation={[0.1, 0, 0]}>
            <NeuralParticles />
            <NeuralConnections />
        </group>
    );
}

/**
 * Canvas + config. Handles:
 * - DPR capping for performance
 * - Reduced motion: renders 1 frame then stops
 * - Camera placement
 */
export default function SceneContainer() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);

        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 50 }}
            frameloop={reducedMotion ? "demand" : "always"}
            gl={{
                antialias: false, // Not needed for particles
                alpha: true, // Transparent background
                powerPreference: "high-performance",
            }}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "auto",

            }}
            aria-hidden="true" // Decorative — not accessible content
        >
            {/* No background color — transparent to show the page bg */}
            <Suspense fallback={null}>
                <SceneContents />
            </Suspense>
        </Canvas>
    );
}