"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const NODE_COUNT = 60; // Subset of nodes that form connection endpoints
const MAX_CONNECTIONS = 120; // Max line segments
const CONNECTION_DISTANCE = 4.5;
const SPREAD = 10;
const DEPTH = 4;

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */ `
    uniform float uTime;
    attribute float aAlpha;
    varying float vAlpha;

    void main() {
        vec3 pos = position;
        // Subtle wave drift
        pos.x += sin(uTime * 0.15 + pos.y * 0.5) * 0.2;
        pos.y += cos(uTime * 0.12 + pos.x * 0.3) * 0.15;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        vAlpha = aAlpha;
    }
`;

const fragmentShader = /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    varying float vAlpha;

    void main() {
        // Pulsing opacity
        float pulse = 0.5 + 0.5 * sin(uTime * 0.8);
        gl_FragColor = vec4(uColor, vAlpha * pulse * 0.35);
    }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function NeuralConnections() {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    const { positions, alphas, drawCount } = useMemo(() => {
        // Generate node positions
        const nodes: THREE.Vector3[] = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * SPREAD,
                    (Math.random() - 0.5) * SPREAD * 0.5,
                    (Math.random() - 0.5) * DEPTH
                )
            );
        }

        // Find nearby pairs → line segments
        const posArr = new Float32Array(MAX_CONNECTIONS * 2 * 3); // 2 vertices per line
        const alphaArr = new Float32Array(MAX_CONNECTIONS * 2);
        let idx = 0;

        for (let i = 0; i < NODE_COUNT && idx < MAX_CONNECTIONS; i++) {
            for (let j = i + 1; j < NODE_COUNT && idx < MAX_CONNECTIONS; j++) {
                const dist = nodes[i].distanceTo(nodes[j]);
                if (dist < CONNECTION_DISTANCE) {
                    const base = idx * 6;
                    posArr[base + 0] = nodes[i].x;
                    posArr[base + 1] = nodes[i].y;
                    posArr[base + 2] = nodes[i].z;
                    posArr[base + 3] = nodes[j].x;
                    posArr[base + 4] = nodes[j].y;
                    posArr[base + 5] = nodes[j].z;

                    // Closer connections are brighter
                    const alpha = 1 - dist / CONNECTION_DISTANCE;
                    alphaArr[idx * 2 + 0] = alpha;
                    alphaArr[idx * 2 + 1] = alpha;

                    idx++;
                }
            }
        }

        return { positions: posArr, alphas: alphaArr, drawCount: idx * 2 };
    }, []);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#00f0ff") },
        }),
        []
    );

    useFrame(({ clock }) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    });

    return (
        <lineSegments frustumCulled={false}>
            <bufferGeometry drawRange={{ start: 0, count: drawCount }}>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={positions.length / 3}
                />
                <bufferAttribute
                    attach="attributes-aAlpha"
                    args={[alphas, 1]}
                    count={alphas.length}
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
        </lineSegments>
    );
}