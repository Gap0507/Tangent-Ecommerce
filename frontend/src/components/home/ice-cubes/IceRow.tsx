"use client";
import { memo } from "react";
import { ElementConfig } from "./types";
import { IceRowElement } from "./IceRowElement";

interface IceRowProps {
  side: "top" | "bottom";
  elements: ElementConfig[];
  mounted: boolean;
  columnRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
}

export const IceRow = memo(
  function IceRow({ side, elements, mounted, columnRef, isMobile }: IceRowProps) {
    return (
      <div
        ref={columnRef}
        className={`absolute left-0 ${side}-0 w-full h-[150px] z-10 ${isMobile ? "hidden" : ""} 
        ${mounted ? "opacity-100" : "opacity-0"}
        ${side === "top" ? "-translate-y-[30%]" : "translate-y-[30%]"}
         `}
        style={{
          transition: "opacity 0.01s ease-in",
        }}
      >
        {elements.map((element, index) => (
          <IceRowElement
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
    const mobileEqual = prevProps.isMobile === nextProps.isMobile;
    const elementsEqual =
      prevProps.elements.length === nextProps.elements.length &&
      JSON.stringify(prevProps.elements) === JSON.stringify(nextProps.elements);

    return sideEqual && mobileEqual && elementsEqual;
  }
);

export default IceRow;
