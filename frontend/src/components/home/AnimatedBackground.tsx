"use client";
import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

interface AnimatedBackgroundProps {
  backgroundColor: string;
  duration?: number;
}

export default function AnimatedBackground({
  backgroundColor,
}: AnimatedBackgroundProps) {
  // Use refs for color tracking to avoid re-render loops that cause blinks
  const currentColorRef = useRef(backgroundColor);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const currentBgRef = useRef<HTMLDivElement>(null);
  const nextBgRef = useRef<HTMLDivElement>(null);
  const initialRenderRef = useRef(true);

  // Pre-create the animation timeline for reuse
  const createAnimation = useCallback(
    (nextBgElement: HTMLDivElement, newColor: string) => {
      // Kill any existing animations immediately
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }

      // Use solid color — NOT a radial-gradient. The clip-path circle already
      // provides the expanding-circle visual. A gradient fading to transparent
      // at the edges lets the OLD base color bleed through the corners.
      nextBgElement.style.background = "none";
      nextBgElement.style.backgroundColor = newColor;
      nextBgElement.style.display = "block";

      // Apply initial GSAP properties with force3D for hardware acceleration
      gsap.set(nextBgElement, {
        clipPath: "circle(0% at center)",
        opacity: 1,
        zIndex: -2,
        force3D: true,
        willChange: "clip-path",
      });

      // Create the optimized timeline
      return gsap.timeline({
        onComplete: () => {
          // Update ref synchronously — no state update, no re-render, no blink
          currentColorRef.current = newColor;

          // Directly set the base layer to the new color
          if (currentBgRef.current) {
            currentBgRef.current.style.backgroundColor = newColor;
          }
          // Hide the overlay
          nextBgElement.style.display = "none";
        },
      });
    },
    []
  );

  // Optimized effect for background color change
  useEffect(() => {
    // On first render, just set the color directly
    if (initialRenderRef.current) {
      if (currentBgRef.current) {
        currentBgRef.current.style.backgroundColor = backgroundColor;
      }
      initialRenderRef.current = false;
      currentColorRef.current = backgroundColor;
      return;
    }

    // Skip if color hasn't actually changed (compare against ref, not state)
    if (backgroundColor === currentColorRef.current) return;

    // Ensure we have DOM refs
    if (!currentBgRef.current || !nextBgRef.current) return;

    // Use requestAnimationFrame to start animation on next frame for smoother transition
    requestAnimationFrame(() => {
      if (!nextBgRef.current) return;

      const tl = createAnimation(nextBgRef.current, backgroundColor);

      // Start the animation immediately
      tl.to(nextBgRef.current, {
        clipPath: "circle(150% at center)",
        duration: 1.5,
        ease: "power2.inOut",
        immediateRender: true,
      });

      // Store reference
      animationRef.current = tl;
    });
  }, [backgroundColor, createAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <>
      {/* Base background with current color — NO CSS transition, GSAP handles it */}
      <div ref={currentBgRef} className="absolute inset-0 z-[-3]" />

      {/* Animated overlay - full screen for clip path */}
      <div
        ref={nextBgRef}
        className="absolute inset-0 z-[-2]"
        style={{
          display: "none",
          willChange: "clip-path",
        }}
      />
    </>
  );
}
