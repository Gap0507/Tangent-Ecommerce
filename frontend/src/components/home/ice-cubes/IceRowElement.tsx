"use client";
import Image from "next/image";
import { ElementConfig } from "./types";
import { getImagePath } from "./utils";

interface IceRowElementProps {
  element: ElementConfig;
  side: "top" | "bottom";
  mounted: boolean;
  index: number;
}

export function IceRowElement({ element, side, mounted, index }: IceRowElementProps) {
  let blurAmount = 0;
  if (mounted && element.blurLevel === 1) {
    blurAmount = 1.5;
  } else if (mounted && element.blurLevel === 2) {
    blurAmount = 3;
  }

  const transform = mounted
    ? `${element.rotation} scaleX(${element.flipX || 1}) scaleY(${element.flipY || 1})`
    : "none";

  // Random vertical offset for the row
  const position = mounted ? `${Math.random() * 30}%` : "0%";

  return (
    <div
      key={`${side}-${index}`}
      className={`absolute ${side}-row-element`}
      style={{
        [side === "top" ? "top" : "bottom"]: position,
        left: element.offsetY, // Mapping the generated percent offset to the horizontal axis
        transform,
        zIndex: element.zIndex,
        opacity: mounted ? element.opacity : 0,
        width: `${element.size}px`,
        height: `${element.size}px`,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
      }}
    >
      {mounted && (
        <Image
          src={getImagePath(element.elementType, element.variant)}
          alt={element.elementType === "cube" ? "Ice cube" : "Leaf"}
          width={element.size}
          height={element.size}
          className="object-contain"
        />
      )}
    </div>
  );
}

export default IceRowElement;
