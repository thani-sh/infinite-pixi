# Infinite Pixi

A lightweight, high-performance viewport container and infinite grid manager for PixiJS v8.

## Getting Started

```bash
bun add @thani-sh/infinite-pixi pixi.js
```

```typescript
import { InfiniteCanvas } from "@thani-sh/infinite-pixi";
import * as PIXI from "pixi.js";

// Initialize canvas container in HTML
const container = document.getElementById("canvas-container")!;

const infiniteCanvas = new InfiniteCanvas({
  backgroundColor: 0x121214,
  minScale: 0.2,
  maxScale: 3,
  grid: {
    type: "dots",
    color: 0xffffff,
    alpha: 0.1,
    size: 15,
    radius: 1.5,
  },
});

// Boot the canvas and attach it to the DOM
await infiniteCanvas.init(container);

// Add custom elements to the viewport
const box = new PIXI.Graphics();
box.rect(0, 0, 100, 100).fill({ color: 0x00ffcc });
box.x = -50;
box.y = -50;

infiniteCanvas.contentContainer?.addChild(box);
```
