"use client";

import React, { useRef, useEffect, forwardRef, ReactNode, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF, View, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --- TangentCan ---
const LABEL_METALNESS = 1.0;
const LABEL_ROUGHNESS = 0.42;
const METAL_ROUGHNESS = 0.3;

function tuneMaterial(source: THREE.Material): THREE.Material {
  if (!(source instanceof THREE.MeshStandardMaterial)) return source;
  const mat = source.clone();
  if (mat.map) {
    mat.metalness = LABEL_METALNESS;
    mat.roughness = LABEL_ROUGHNESS;
  } else {
    mat.metalness = 1;
    mat.roughness = METAL_ROUGHNESS;
  }
  mat.needsUpdate = true;
  return mat;
}

export function TangentCan({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

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

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    if (size.y > 0) {
      clonedScene.scale.setScalar(1.9 / size.y); 
    }

    const scaledBox = new THREE.Box3().setFromObject(clonedScene);
    const center = scaledBox.getCenter(new THREE.Vector3());
    clonedScene.position.sub(center);

    while (modelRef.current.children.length > 0) {
      modelRef.current.remove(modelRef.current.children[0]);
    }
    modelRef.current.add(clonedScene);
  }, [scene]);

  return <group ref={modelRef} rotation={[0, Math.PI / 2, 0]} />;
}

// --- FloatingCan ---
type FloatingCanProps = {
  modelPath: string;
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
};

export const FloatingCan = forwardRef<Group, FloatingCanProps>(
  (
    {
      modelPath,
      floatSpeed = 1.5,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      children,
      ...props
    },
    ref
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <TangentCan modelPath={modelPath} />
        </Float>
      </group>
    );
  }
);
FloatingCan.displayName = "FloatingCan";

// --- Bubbles ---
const o = new THREE.Object3D();
export function Bubbles({ count = 300, speed = 5, bubbleSize = 0.05, opacity = 0.5, repeat = true }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const bubbleSpeed = useRef(new Float32Array(count));
  const minSpeed = speed * 0.001;
  const maxSpeed = speed * 0.005;

  const geometry = new THREE.SphereGeometry(bubbleSize, 16, 16);
  const material = new THREE.MeshBasicMaterial({ transparent: true, opacity });

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      o.position.set(gsap.utils.random(-4, 4), gsap.utils.random(-4, 4), gsap.utils.random(-4, -0.5));
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      bubbleSpeed.current[i] = gsap.utils.random(minSpeed, maxSpeed);
    }
    mesh.instanceMatrix.needsUpdate = true;
    return () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    };
  }, [count, minSpeed, maxSpeed]);

  useFrame(() => {
    if (!meshRef.current) return;
    material.color = new THREE.Color(document.body.style.backgroundColor || "#FDE046");

    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, o.matrix);
      o.position.setFromMatrixPosition(o.matrix);
      o.position.y += bubbleSpeed.current[i];

      if (o.position.y > 4 && repeat) {
        o.position.y = -2;
        o.position.x = gsap.utils.random(-4, 4);
        o.position.z = gsap.utils.random(-4, -0.5);
      }
      o.updateMatrix();
      meshRef.current.setMatrixAt(i, o.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0, 0, 0]} material={material} geometry={geometry}></instancedMesh>
  );
}

// --- Scene ---
export function Scene() {
  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);
  const can4Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);
  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (!can1Ref.current || !can2Ref.current || !can3Ref.current || !can4Ref.current || !can1GroupRef.current || !can2GroupRef.current || !groupRef.current) return;

    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      if (!can1Ref.current || !can2Ref.current || !can3Ref.current || !can4Ref.current || !can1GroupRef.current || !can2GroupRef.current || !groupRef.current) return;
      
      let { isDesktop, isMobile } = context.conditions as { isDesktop: boolean, isMobile: boolean };

      // Set initial scale for the entire group
      gsap.set(groupRef.current.scale, {
        x: isDesktop ? 1 : 0.38,
        y: isDesktop ? 1 : 0.38,
        z: isDesktop ? 1 : 0.38
      });

      // Desktop: Side by side on left/right. Mobile: Side by side under text (Guava on left tilted right, Yuzu on right tilted left).
      gsap.set(can1Ref.current.position, { 
        x: isDesktop ? -1.5 : -0.6,
        y: isDesktop ? 0 : -0.22
      });
      gsap.set(can1Ref.current.rotation, { z: -0.4 });
      
      gsap.set(can2Ref.current.position, { 
        x: isDesktop ? 1.5 : 0.6,
        y: isDesktop ? 0 : -0.22 
      });
      gsap.set(can2Ref.current.rotation, { z: 0.4 });

      gsap.set(can3Ref.current.position, { x: isDesktop ? 5 : 4, z: 2 });
      gsap.set(can4Ref.current.position, { y: -5 });

      const introTl = gsap.timeline({ defaults: { duration: 3, ease: "back.out(1.4)" } });

      if (window.scrollY < 20) {
        introTl
          .from(can1GroupRef.current.position, { y: -5, x: isDesktop ? 1 : -0.5 }, 0)
          .from(can1GroupRef.current.position, { z: 3 }, 0)
          .from(can2GroupRef.current.position, { y: 5, x: isDesktop ? 1 : 0.5 }, 0)
          .from(can2GroupRef.current.position, { z: 5 }, 0);
      }

      const scrollTl = gsap.timeline({
        defaults: { duration: 2 },
        scrollTrigger: { trigger: ".hero-container", start: "top top", end: "bottom bottom", scrub: 1.5 },
      });

      scrollTl
        .to(groupRef.current.rotation, { y: Math.PI * 2 }, 0)
        .to(groupRef.current.scale, { 
          x: isDesktop ? 0.75 : 0.32, 
          y: isDesktop ? 0.75 : 0.32, 
          z: isDesktop ? 0.75 : 0.32 
        }, 0)
        // Can 1 (Bottom Left)
        .to(can1Ref.current.position, { x: isDesktop ? -0.9 : -0.6, y: isDesktop ? -0.4 : -0.3, z: 0.2 }, 0)
        .to(can1Ref.current.rotation, { z: 0.3 }, 0)
        // Can 2 (Top Right)
        .to(can2Ref.current.position, { x: isDesktop ? 0.8 : 0.5, y: isDesktop ? 0.4 : 0.3, z: -0.2 }, 0)
        .to(can2Ref.current.rotation, { z: -0.2 }, 0)
        // Can 3 (Top Left)
        .to(can3Ref.current.position, { x: isDesktop ? -0.3 : -0.2, y: isDesktop ? 0.6 : 0.4, z: -0.6 }, 0)
        .to(can3Ref.current.rotation, { z: -0.1 }, 0)
        // Can 4 (Front Center)
        .to(can4Ref.current.position, { x: 0, y: isDesktop ? -0.2 : -0.1, z: 0.6 }, 0)
        .to(can4Ref.current.rotation, { z: 0.1 }, 0)
        .to(groupRef.current.position, { 
          x: isDesktop ? 1 : 0, 
          y: isDesktop ? -0.3 : 1.1, 
          duration: 3, 
          ease: "sine.inOut" 
        }, 1.3);
    });
  });

  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan ref={can1Ref} modelPath="/assets/3d/can/Tangent_Guava_Chilli_FINAL_4K.glb" floatSpeed={FLOAT_SPEED} />
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan ref={can2Ref} modelPath="/assets/3d/can/Tangent_Yuzu_Mint_FINAL_4K.glb" floatSpeed={FLOAT_SPEED} />
      </group>
      <FloatingCan ref={can3Ref} modelPath="/assets/3d/can/Tangent_Watermelon_Mint.glb" floatSpeed={FLOAT_SPEED} />
      <FloatingCan ref={can4Ref} modelPath="/assets/3d/can/Tangent_Watermelon_Cranberry_v2_FINAL_4K.glb" floatSpeed={FLOAT_SPEED} />
      <Environment resolution={512} environmentIntensity={0.8}>
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
    </group>
  );
}

// --- ViewCanvas ---
const Loader = dynamic(() => import("@react-three/drei").then((mod) => mod.Loader), { ssr: false });

export function ViewCanvas() {
  return (
    <>
      <Canvas
        style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", overflow: "hidden", pointerEvents: "none", zIndex: 30 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 30 }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
