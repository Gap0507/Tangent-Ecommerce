"use client";
import { memo } from "react";
import { ColumnProps } from "./types";
import { IceElement } from "./IceElement";

export const IceColumn = memo(
  function IceColumn({
    side,
    elements,
    containerWidth,
    mounted,
    columnRef,
    isMobile,
  }: ColumnProps) {
    return (
      <div
        ref={columnRef}
        className={`absolute ${side}-0 top-0 h-full z-10 ${isMobile ? "hidden" : ""} 
        ${mounted ? "opacity-100" : "opacity-0"}
        ${side === "left" ? "-translate-x-[50%]" : "translate-x-[50%]"}
         `}
        style={{
          width: `calc((100% - ${containerWidth}px) / 2)`,
          transition: "opacity 0.01s ease-in",
        }}
      >
        {elements.map((element, index) => (
          <IceElement
            key={`${side}-${index}`}
            element={element}
            side={side}
            mounted={mounted}
            index={index}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.mounted === false && nextProps.mounted === true) {
      return false;
    }

    const sideEqual = prevProps.side === nextProps.side;
    const widthEqual = prevProps.containerWidth === nextProps.containerWidth;
    const mobileEqual = prevProps.isMobile === nextProps.isMobile;
    const elementsEqual =
      prevProps.elements.length === nextProps.elements.length &&
      JSON.stringify(prevProps.elements) === JSON.stringify(nextProps.elements);

    return sideEqual && widthEqual && mobileEqual && elementsEqual;
  }
);

export default IceColumn;
