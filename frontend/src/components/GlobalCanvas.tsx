"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

export function GlobalCanvas() {
  const pathname = usePathname();

  // Only mount the WebGL context on pages that use 3D Views
  if (pathname !== "/") return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <Canvas
        style={{ pointerEvents: "none" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0, 5],
          fov: 30,
          near: 0.1,
          far: 200,
        }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
    </div>
  );
}
