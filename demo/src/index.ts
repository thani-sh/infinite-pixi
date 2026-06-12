import * as PIXI from "pixi.js";
import { InfiniteCanvas, GridBackground } from "./lib/index.js";

// Initialize canvas container in HTML
const container = document.getElementById("canvas-container") as HTMLElement;

const infiniteCanvas = new InfiniteCanvas({
  backgroundColor: 0x0f0b0f,
  minScale: 0.15,
  maxScale: 4.0,
  grid: {
    type: "dots",
    color: 0xff73a8,
    alpha: 0.08,
    size: 20,
    radius: 1.5,
  },
});

await infiniteCanvas.init(container);

const app = infiniteCanvas.app;
const viewport = infiniteCanvas.viewport;
const content = infiniteCanvas.contentContainer;

if (app && viewport && content) {
  // Add some sample interactive visual shapes
  const mainColor = 0xff73a8;
  const accentColor = 0x00ffcc;

  // 1. Draw a central decorative target node
  const centerNode = new PIXI.Graphics();
  centerNode.circle(0, 0, 80).fill({ color: mainColor, alpha: 0.15 });
  centerNode.circle(0, 0, 40).fill({ color: mainColor, alpha: 0.3 });
  centerNode.circle(0, 0, 10).fill({ color: mainColor, alpha: 0.8 });
  content.addChild(centerNode);

  // 2. Add some scattered panels around the canvas
  const card1 = new PIXI.Graphics();
  card1.rect(-400, -250, 200, 150).fill({ color: accentColor, alpha: 0.25 });
  card1.rect(-400, -250, 200, 4).fill({ color: accentColor, alpha: 0.8 });
  content.addChild(card1);

  const card2 = new PIXI.Graphics();
  card2.rect(200, -100, 200, 150).fill({ color: mainColor, alpha: 0.2 });
  card2.rect(200, -100, 200, 4).fill({ color: mainColor, alpha: 0.8 });
  content.addChild(card2);

  const card3 = new PIXI.Graphics();
  card3.rect(-100, 200, 200, 150).fill({ color: 0x9b51e0, alpha: 0.25 });
  card3.rect(-100, 200, 200, 4).fill({ color: 0x9b51e0, alpha: 0.8 });
  content.addChild(card3);

  // Re-sync and display the current zoom level inside the HUD overlay
  app.ticker.add(() => {
    const zoomText = document.getElementById("zoom-value");
    if (zoomText) {
      zoomText.textContent = `${viewport.scale.x.toFixed(2)}x`;
    }
  });

  // Recreate grid helper when toggled
  const toggleGrid = (type: "dots" | "lines"): void => {
    if (!infiniteCanvas.grid) return;
    app.stage.removeChild(infiniteCanvas.grid);
    infiniteCanvas.grid.destroy();

    const gridOptions = {
      type,
      color: type === "dots" ? 0xff73a8 : 0xffffff,
      alpha: type === "dots" ? 0.08 : 0.04,
      size: 20,
      radius: 1.5,
      thickness: 1,
    };

    infiniteCanvas.grid = new GridBackground(app, gridOptions);
    // Insert at index 0 to stay behind the viewport container
    app.stage.addChildAt(infiniteCanvas.grid, 0);
  };

  // Wire UI control events
  const dotsBtn = document.getElementById("grid-dots-btn") as HTMLButtonElement;
  const linesBtn = document.getElementById(
    "grid-lines-btn",
  ) as HTMLButtonElement;
  const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

  dotsBtn.addEventListener("click", () => {
    dotsBtn.classList.add("active");
    linesBtn.classList.remove("active");
    toggleGrid("dots");
  });

  linesBtn.addEventListener("click", () => {
    linesBtn.classList.add("active");
    dotsBtn.classList.remove("active");
    toggleGrid("lines");
  });

  resetBtn.addEventListener("click", () => {
    infiniteCanvas.resetViewport();
  });
}
