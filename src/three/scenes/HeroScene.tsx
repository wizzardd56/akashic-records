"use client";
import SceneContainer from "../components/SceneContainer";

export function HeroScene() {
    return (
        <div
            className="absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
            role="presentation"
        >
            <SceneContainer />
        </div>
    );
}