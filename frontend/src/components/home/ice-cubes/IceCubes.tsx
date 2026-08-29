"use client";
import React, { useRef, useEffect, useState, memo } from "react";
import gsap from "gsap";
import { IceColumn } from "./IceColumn";
import { IceRow } from "./IceRow";
import { ElementConfig, IceCubesProps } from "./types";
import { generateColumnElements, processElementsForBlur } from "./utils";

const IceCubes = memo(function IceCubes({
  containerWidth = 1220,
  cubeCount = 6,
  leafCount = 4,
}: IceCubesProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const serverSideLeftElements = Array(cubeCount + leafCount)
    .fill(null)
    .map((_, i) => ({
      size: 50,
      rotation: "none",
      flipX: 1,
      flipY: 1,
      zIndex: 10,
      opacity: 0,
      elementType: "cube" as const,
      offsetY: `${i * 10}%`,
      animationDelay: 0,
      blurLevel: 0,
    }));

  const serverSideRightElements = Array(cubeCount + leafCount)
    .fill(null)
    .map((_, i) => ({
      size: 50,
      rotation: "none",
      flipX: 1,
      flipY: 1,
      zIndex: 10,
      opacity: 0,
      elementType: "cube" as const,
      offsetY: `${i * 10}%`,
      animationDelay: 0,
      blurLevel: 0,
    }));

  const serverSideTopElements = Array(cubeCount + leafCount)
    .fill(null)
    .map((_, i) => ({
      size: 50,
      rotation: "none",
      flipX: 1,
      flipY: 1,
      zIndex: 10,
      opacity: 0,
      elementType: "cube" as const,
      offsetY: `${i * 10}%`,
      animationDelay: 0,
      blurLevel: 0,
    }));

  const serverSideBottomElements = Array(cubeCount + leafCount)
    .fill(null)
    .map((_, i) => ({
      size: 50,
      rotation: "none",
      flipX: 1,
      flipY: 1,
      zIndex: 10,
      opacity: 0,
      elementType: "cube" as const,
      offsetY: `${i * 10}%`,
      animationDelay: 0,
      blurLevel: 0,
    }));

  const generatedElementsRef = useRef<{
    left: ElementConfig[];
    right: ElementConfig[];
    top: ElementConfig[];
    bottom: ElementConfig[];
  } | null>(null);

  if (!generatedElementsRef.current) {
    const left = processElementsForBlur(generateColumnElements("left", cubeCount, leafCount));
    const right = processElementsForBlur(generateColumnElements("right", cubeCount, leafCount));
    const top = processElementsForBlur(generateColumnElements("left", cubeCount, leafCount));
    const bottom = processElementsForBlur(generateColumnElements("right", cubeCount, leafCount));
    generatedElementsRef.current = { left, right, top, bottom };
  }

  useEffect(() => {
    setMounted(true);

    const ctx = gsap.context(() => {
      setTimeout(() => {
        const leftCubeElements = document.querySelectorAll(".left-cube");
        const rightCubeElements = document.querySelectorAll(".right-cube");
        const topCubeElements = document.querySelectorAll(".top-row-element");
        const bottomCubeElements = document.querySelectorAll(".bottom-row-element");
        const tl = gsap.timeline();

        leftCubeElements.forEach((cube, index) => {
          if (generatedElementsRef.current && index < generatedElementsRef.current.left.length) {
            tl.to(
              cube,
              {
                y: "+=10",
                rotation: "+=5",
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: generatedElementsRef.current.left[index].animationDelay,
              },
              index * 0.05
            );
          }
        });

        rightCubeElements.forEach((cube, index) => {
          if (generatedElementsRef.current && index < generatedElementsRef.current.right.length) {
            tl.to(
              cube,
              {
                y: "+=10",
                rotation: "-=5",
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: generatedElementsRef.current.right[index].animationDelay,
              },
              index * 0.05
            );
          }
        });

        topCubeElements.forEach((cube, index) => {
          if (generatedElementsRef.current && index < generatedElementsRef.current.top.length) {
            tl.to(
              cube,
              {
                x: "+=10",
                rotation: "+=5",
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: generatedElementsRef.current.top[index].animationDelay,
              },
              index * 0.05
            );
          }
        });

        bottomCubeElements.forEach((cube, index) => {
          if (generatedElementsRef.current && index < generatedElementsRef.current.bottom.length) {
            tl.to(
              cube,
              {
                x: "+=10",
                rotation: "-=5",
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: generatedElementsRef.current.bottom[index].animationDelay,
              },
              index * 0.05
            );
          }
        });
      }, 100);
    });

    return () => ctx.revert();
  }, []);

  const leftElements =
    mounted && generatedElementsRef.current
      ? generatedElementsRef.current.left
      : serverSideLeftElements;
  const rightElements =
    mounted && generatedElementsRef.current
      ? generatedElementsRef.current.right
      : serverSideRightElements;
  const topElements =
    mounted && generatedElementsRef.current
      ? generatedElementsRef.current.top
      : serverSideTopElements;
  const bottomElements =
    mounted && generatedElementsRef.current
      ? generatedElementsRef.current.bottom
      : serverSideBottomElements;

  return (
    <>
      <IceColumn
        side="left"
        elements={leftElements}
        containerWidth={containerWidth}
        mounted={mounted}
        columnRef={leftColumnRef as React.RefObject<HTMLDivElement | null>}
        isMobile={isMobile}
      />
      <IceColumn
        side="right"
        elements={rightElements}
        containerWidth={containerWidth}
        mounted={mounted}
        columnRef={rightColumnRef as React.RefObject<HTMLDivElement | null>}
        isMobile={isMobile}
      />
      <IceRow
        side="top"
        elements={topElements}
        mounted={mounted}
        columnRef={topRowRef as React.RefObject<HTMLDivElement | null>}
        isMobile={isMobile}
      />
      <IceRow
        side="bottom"
        elements={bottomElements}
        mounted={mounted}
        columnRef={bottomRowRef as React.RefObject<HTMLDivElement | null>}
        isMobile={isMobile}
      />
    </>
  );
});

export default IceCubes;
