"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PARTICLE_COUNT = 800;
const SPREAD = 12;
const DEPTH = 6;

// ---------------------------------------------------------------------------
// Shaders (GLSL) — run entirely on the GPU
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    uniform vec2 uPointer;

    attribute float aScale;
    attribute float aSpeed;
    attribute float aPhase;

    varying float vAlpha;
    varying float vDistToCenter;

    void main() {
        vec3 pos = position;

        // Gentle orbital drift — each particle has its own phase & speed
        float t = uTime * aSpeed;
        pos.x += sin(t + aPhase) * 0.3;
        pos.y += cos(t + aPhase * 1.3) * 0.25;
        pos.z += sin(t * 0.7 + aPhase * 0.5) * 0.15;

        // Subtle pointer repulsion — particles drift away from mouse
        vec3 pointerWorld = vec3(uPointer.x * 6.0, uPointer.y * 4.0, 0.0);
        vec3 diff = pos - pointerWorld;
        float pointerDist = length(diff);
        float repulsion = smoothstep(3.0, 0.0, pointerDist) * 0.8;
        pos += normalize(diff + 0.001) * repulsion;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

        // Size attenuation — closer = larger
        gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);
        gl_PointSize = max(gl_PointSize, 1.0);

        gl_Position = projectionMatrix * mvPosition;

        // Pass alpha based on depth (farther = more transparent)
        float depthFade = smoothstep(-15.0, -2.0, mvPosition.z);
        vAlpha = depthFade * 0.9;

        // Distance from world center for color mixing
        vDistToCenter = length(position.xy) / ${SPREAD.toFixed(1)};
    }
`;

const fragmentShader = /* glsl */ `
    uniform vec3 uColorCyan;
    uniform vec3 uColorPurple;

    varying float vAlpha;
    varying float vDistToCenter;

    void main() {
        // Circular soft glow — distance from point center
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);

        // Discard outside circle
        if (dist > 0.5) discard;

        // Soft radial gradient with exponential falloff
        float glow = exp(-dist * 6.0);

        // Color gradient: cyan at center, purple at edges
        vec3 color = mix(uColorCyan, uColorPurple, smoothstep(0.3, 0.8, vDistToCenter));

        gl_FragColor = vec4(color, glow * vAlpha);
    }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function NeuralParticles() {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    // Generate particle attributes ONCE
    const { positions, scales, speeds, phases } = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const scl = new Float32Array(PARTICLE_COUNT);
        const spd = new Float32Array(PARTICLE_COUNT);
        const phs = new Float32Array(PARTICLE_COUNT);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Distribute in a flattened ellipsoid
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = Math.pow(Math.random(), 0.6) * SPREAD; // bias toward center

            pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5; // flatten Y
            pos[i * 3 + 2] = (Math.random() - 0.5) * DEPTH;

            scl[i] = 0.5 + Math.random() * 1.5;
            spd[i] = 0.1 + Math.random() * 0.3;
            phs[i] = Math.random() * Math.PI * 2;
        }

        return { positions: pos, scales: scl, speeds: spd, phases: phs };
    }, []);

    // Uniforms — memoized to avoid re-creation
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            uSize: { value: 150 },
            uPointer: { value: new THREE.Vector2(0, 0) },
            uColorCyan: { value: new THREE.Color("#00f0ff") },
            uColorPurple: { value: new THREE.Color("#a78bfa") },
        }),
        []
    );

    // Animation loop — mutates uniforms directly, zero React state
    useFrame(({ clock, pointer }) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        materialRef.current.uniforms.uPointer.value.set(pointer.x, pointer.y);
    });

    return (
        <points frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={PARTICLE_COUNT}
                />
                <bufferAttribute
                    attach="attributes-aScale"
                    args={[scales, 1]}
                    count={PARTICLE_COUNT}
                />
                <bufferAttribute
                    attach="attributes-aSpeed"
                    args={[speeds, 1]}
                    count={PARTICLE_COUNT}
                />
                <bufferAttribute
                    attach="attributes-aPhase"
                    args={[phases, 1]}
                    count={PARTICLE_COUNT}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}