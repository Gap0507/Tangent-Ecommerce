"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PresentationControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Can3DProps {
  modelPath: string;
  isMobile: boolean;
  rotation?: number[];
}

function CanModel({ modelPath, isMobile, rotation }: Can3DProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "auto";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const smoothOscillation = (time: number, frequency: number) => {
    const t = (time * frequency) % 2;
    return t <= 1 ? t : 2 - t;
  };

  useFrame((_state, delta) => {
    if (modelRef.current) {
      timeRef.current += delta * 0.6;
      const mobileMultiplier = isMobile ? 0.3 : 1;
      const xOffset = (smoothOscillation(timeRef.current, 0.3) * 2 - 1) * 0.05 * mobileMultiplier;
      const yOffset = (smoothOscillation(timeRef.current, 0.2) * 2 - 1) * 0.03 * mobileMultiplier;
      const zOffset = (smoothOscillation(timeRef.current, 0.25) * 2 - 1) * 0.05 * mobileMultiplier;

      const baseRotation = rotation || [0, Math.PI / 3, 0];
      modelRef.current.rotation.x = baseRotation[0] + xOffset;
      modelRef.current.rotation.y = baseRotation[1] + yOffset;
      modelRef.current.rotation.z = baseRotation[2] + zOffset;
    }
  });

  useEffect(() => {
    if (modelRef.current) {
      const clonedScene = scene.clone();
      clonedScene.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const mesh = o as THREE.Mesh;
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.metalness = 0.95;
            mesh.material.roughness = 0.02;
            mesh.material.alphaTest = 0.1;
          }
        }
      });
      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
      }
      modelRef.current.add(clonedScene);
    }
  }, [scene]);

  const scale = isMobile ? 1.05 : 1.4;
  const position = [0, -0.05, 0];

  return (
    <group
      ref={modelRef}
      scale={scale}
      position={position as [number, number, number]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => {
        document.body.style.cursor = "grabbing";
      }}
      onPointerUp={() => {
        document.body.style.cursor = hovered ? "grab" : "auto";
      }}
    ></group>
  );
}

export default function Can3DViewer({ modelPath, isMobile, rotation }: Can3DProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
          alpha: true,
          powerPreference: isMobile ? "default" : "high-performance",
        }}
        camera={{
          position: [0, 0, 1],
          fov: isMobile ? 24 : 22,
          near: 0.01,
          far: 100,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <PresentationControls
            global={false}
            cursor={false}
            snap={true}
            speed={isMobile ? 1.5 : 1}
            zoom={1}
            rotation={[0, 0, 0.1]}
            polar={[0, Math.PI / 10]}
            azimuth={[-Math.PI, Math.PI]}
          >
            <CanModel modelPath={modelPath} isMobile={isMobile} rotation={rotation} />
          </PresentationControls>
          <Environment
            preset="forest"
            resolution={isMobile ? 2 : 8}
            environmentIntensity={1.2}
          />
          <ambientLight intensity={10} />
          <directionalLight intensity={20} position={[5, 5, 5]} />
          <directionalLight intensity={10} position={[-1, -1, -1]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
