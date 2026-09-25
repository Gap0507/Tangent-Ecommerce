"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

interface Can3DProps {
  modelPath: string;
  isMobile: boolean;
  rotation?: number[];
  positionOffset?: [number, number, number];
}

/* ------------------------------------------------------------------
 * QUICK TUNING — change only these numbers.
 *
 * The GLB label is metallic (like your reference render), so its colour
 * comes from reflecting the environment. Keep metalness high for rich,
 * true colours, and use roughness to blur the reflections (no streaks).
 * ------------------------------------------------------------------ */
const LABEL_METALNESS = 1.0; // 1.0 = richest colour (matches real can), lower = lighter/washed
const LABEL_ROUGHNESS = 0.42; // higher = softer reflections, lower = glossier
const METAL_ROUGHNESS = 0.3; // aluminium top / bottom / rim
const ENV_INTENSITY = 0.8; // overall brightness (0.7 deeper, 1.0 lighter)

function tuneMaterial(source: THREE.Material): THREE.Material {
  if (!(source instanceof THREE.MeshStandardMaterial)) return source;

  // Clone so we never mutate the cached GLTF shared by other canvases
  const mat = source.clone();

  if (mat.map) {
    // Printed label (has the artwork texture)
    mat.metalness = LABEL_METALNESS;
    mat.roughness = LABEL_ROUGHNESS;
  } else {
    // Aluminium + plain coloured parts
    mat.metalness = 1;
    mat.roughness = METAL_ROUGHNESS;
  }

  mat.needsUpdate = true;
  return mat;
}

function CanModel({
  modelPath,
  isMobile,
  rotation,
  positionOffset = [0, 0, 0],
}: Can3DProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "grab" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const smoothOscillation = (time: number, frequency: number) => {
    const t = (time * frequency) % 2;
    return t <= 1 ? t : 2 - t;
  };

  useFrame((_state, delta) => {
    if (!modelRef.current) return;

    timeRef.current += delta * 0.6;
    const mobileMultiplier = isMobile ? 0.3 : 1;
    const xOffset =
      (smoothOscillation(timeRef.current, 0.3) * 2 - 1) * 0.05 * mobileMultiplier;
    const yOffset =
      (smoothOscillation(timeRef.current, 0.2) * 2 - 1) * 0.03 * mobileMultiplier;
    const zOffset =
      (smoothOscillation(timeRef.current, 0.25) * 2 - 1) * 0.05 * mobileMultiplier;

    const baseRotation = rotation || [0, Math.PI / 3, 0];
    modelRef.current.rotation.x = baseRotation[0] + xOffset;
    modelRef.current.rotation.y = baseRotation[1] + yOffset;
    modelRef.current.rotation.z = baseRotation[2] + zOffset;
  });

  useEffect(() => {
    if (!modelRef.current) return;

    const clonedScene = scene.clone();

    clonedScene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(tuneMaterial)
        : tuneMaterial(mesh.material);
    });

    // Normalize model size and center it
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());

    const targetHeight = 0.23;
    if (size.y > 0) {
      clonedScene.scale.setScalar(targetHeight / size.y);
    }

    const scaledBox = new THREE.Box3().setFromObject(clonedScene);
    const center = scaledBox.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);

    while (modelRef.current.children.length > 0) {
      modelRef.current.remove(modelRef.current.children[0]);
    }
    modelRef.current.add(clonedScene);

    return () => {
      clonedScene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => m.dispose());
      });
    };
  }, [scene]);

  const scale = isMobile ? 0.9 : 1.2; // can size: raise = bigger, lower = smaller
  const position: [number, number, number] = [
    0 + positionOffset[0],
    -0.01 + positionOffset[1],
    0 + positionOffset[2],
  ];

  return (
    <group
      ref={modelRef}
      scale={scale}
      position={position}
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

export default function Can3DViewer({
  modelPath,
  isMobile,
  rotation,
  positionOffset,
}: Can3DProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows={false}
        dpr={[1, 2]}
        gl={{
          // No tone mapping = label colours stay true to the texture
          // (ACES was fading the reds).
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
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
            <CanModel
              modelPath={modelPath}
              isMobile={isMobile}
              rotation={rotation}
              positionOffset={positionOffset}
            />
          </PresentationControls>

          {/*
            Soft "studio room": big even walls (~1.0 = true colours), a soft
            top light for the shoulders, and ONE gentle side sheen.
            No ambient/directional lights — on a metallic surface they only
            add hard glare.
          */}
          <Environment
            resolution={isMobile ? 256 : 512}
            environmentIntensity={ENV_INTENSITY}
          >
            {/* even walls */}
            <Lightformer form="rect" intensity={0.9} position={[0, 0, 10]} scale={[30, 30, 1]} />
            <Lightformer form="rect" intensity={0.9} position={[-10, 0, 0]} scale={[30, 30, 1]} />
            <Lightformer form="rect" intensity={0.9} position={[10, 0, 0]} scale={[30, 30, 1]} />
            <Lightformer form="rect" intensity={0.6} position={[0, 0, -10]} scale={[30, 30, 1]} />
            <Lightformer form="rect" intensity={0.4} position={[0, -10, 0]} scale={[30, 30, 1]} />
            {/* soft top light */}
            <Lightformer form="rect" intensity={0.9} position={[0, 10, 2]} scale={[24, 12, 1]} />
            {/* one gentle side sheen */}
            <Lightformer form="rect" intensity={1.1} position={[-7, 2, 6]} scale={[5, 16, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload 3D GLB assets for Vercel CDN speed
useGLTF.preload("/assets/3d/can/Tangent_Watermelon_Cranberry_v2_FINAL_4K.glb");
useGLTF.preload("/assets/3d/can/Tangent_Watermelon_Mint.glb");
useGLTF.preload("/assets/3d/can/Tangent_Guava_Chilli_FINAL_4K.glb");
useGLTF.preload("/assets/3d/can/Tangent_Yuzu_Mint_FINAL_4K.glb");