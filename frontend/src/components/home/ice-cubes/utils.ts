import { ElementConfig } from "./types";

export function getImagePath(elementType: "cube" | "leaf", variant?: 1 | 2): string {
  if (elementType === "cube") {
    return `/assets/images/ice/cube.webp`;
  } else if (elementType === "leaf" && variant) {
    return `/assets/images/leaf/${variant}.png`;
  }
  return `/assets/images/ice/cube.webp`;
}

export function generateColumnElements(
  side: "left" | "right",
  cubeCount: number,
  leafCount: number
): ElementConfig[] {
  const elements: ElementConfig[] = [];

  const cubePositions: string[] = [];
  for (let i = 0; i < cubeCount; i++) {
    const position = i * (95 / (cubeCount - 1 || 1));
    cubePositions.push(`${position}%`);
  }

  const leafPositions: string[] = [];
  for (let i = 0; i < leafCount; i++) {
    const position = i * (95 / (leafCount - 1 || 1));
    leafPositions.push(`${position}%`);
  }

  const cubeElements: ElementConfig[] = [];
  const firstBigCubeIndex = Math.floor(cubeCount * 0.2);
  const secondBigCubeIndex = Math.floor(cubeCount * 0.8);

  for (let i = 0; i < cubeCount; i++) {
    const allowBigSize = (i === firstBigCubeIndex || i === secondBigCubeIndex) && cubeCount >= 4;
    cubeElements.push(
      createElementWithSizeControl(
        "cube",
        side,
        i,
        undefined,
        cubePositions[i],
        allowBigSize
      )
    );
  }

  cubeElements.sort((a, b) => b.size - a.size);
  elements.push(...cubeElements);

  for (let i = 0; i < leafCount; i++) {
    elements.push(
      createElement(
        "leaf",
        side,
        i + cubeCount,
        ((i % 2) + 1) as 1 | 2,
        leafPositions[i]
      )
    );
  }

  return elements;
}

export function createElementWithSizeControl(
  elementType: "cube" | "leaf",
  side: "left" | "right",
  index: number,
  variant?: 1 | 2,
  offsetY?: string,
  allowBigSize: boolean = false
): ElementConfig {
  let minSize, maxSize;

  if (elementType === "cube") {
    if (allowBigSize) {
      minSize = side === "left" ? 80 : 90;
      maxSize = side === "left" ? 100 : 110;
    } else {
      minSize = side === "left" ? 40 : 50;
      maxSize = side === "left" ? 70 : 80;
    }
  } else {
    minSize = side === "left" ? 45 : 50;
    maxSize = side === "left" ? 90 : 100;
  }

  const size = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
  const rotationBase = elementType === "leaf" ? 30 : 20;
  const rotationFactor = side === "left" ? -rotationBase : rotationBase;
  const rotation = `rotate(${Math.floor(Math.random() * 30) + rotationFactor}deg)`;
  const flipX = Math.random() > 0.5 ? -1 : 1;
  const flipY = Math.random() > 0.5 ? -1 : 1;
  const opacityBase = side === "left" ? 0.6 : 0.65;
  const opacity = Math.random() * 0.3 + opacityBase;
  const zIndex = Math.floor(size / 10) + 5;
  const delayFactor = side === "left" ? 0 : 0.5;
  const animationDelay = Math.random() * 2 + delayFactor;

  return {
    size,
    rotation,
    flipX,
    flipY,
    zIndex,
    opacity,
    elementType,
    variant,
    offsetY: offsetY || "0%",
    animationDelay,
  };
}

export function createElement(
  elementType: "cube" | "leaf",
  side: "left" | "right",
  index: number,
  variant?: 1 | 2,
  offsetY?: string
): ElementConfig {
  let minSize, maxSize;

  if (elementType === "cube") {
    minSize = side === "left" ? 40 : 50;
    maxSize = side === "left" ? 100 : 110;
  } else {
    minSize = side === "left" ? 45 : 50;
    maxSize = side === "left" ? 90 : 100;
  }

  const size = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
  const rotationBase = elementType === "leaf" ? 30 : 20;
  const rotationFactor = side === "left" ? -rotationBase : rotationBase;
  const rotation = `rotate(${Math.floor(Math.random() * 30) + rotationFactor}deg)`;
  const flipX = Math.random() > 0.5 ? -1 : 1;
  const flipY = Math.random() > 0.5 ? -1 : 1;
  const opacityBase = side === "left" ? 0.6 : 0.65;
  const opacity = Math.random() * 0.3 + opacityBase;
  const zIndex = Math.floor(size / 10) + 5;
  const delayFactor = side === "left" ? 0 : 0.5;
  const animationDelay = Math.random() * 2 + delayFactor;

  return {
    size,
    rotation,
    flipX,
    flipY,
    zIndex,
    opacity,
    elementType,
    variant,
    offsetY: offsetY || "0%",
    animationDelay,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function processElementsForBlur(elements: ElementConfig[]): ElementConfig[] {
  const sortedBySize = [...elements].sort((a, b) => b.size - a.size);
  const totalCount = elements.length;
  const noBlurThreshold = sortedBySize[Math.floor(totalCount * 0.6)]?.size || 0;
  const lightBlurThreshold = sortedBySize[Math.floor(totalCount * 0.8)]?.size || 0;

  return elements.map((element) => {
    let blurLevel = 0;
    if (element.size < lightBlurThreshold) {
      blurLevel = 2;
    } else if (element.size < noBlurThreshold) {
      blurLevel = 1;
    }
    return {
      ...element,
      blurLevel,
    };
  });
}
