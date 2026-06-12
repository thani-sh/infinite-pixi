# @thani-sh/infinite-pixi

A lightweight, high-performance viewport container and infinite grid manager for PixiJS v8. It handles camera pan and zoom operations dynamically, centering transitions relative to the user's mouse pointer, and maintains a tiling background that shifts and scales seamlessly.

Designed with SOLID principles and modular abstractions, allowing you to use the high-level bootstrap wrapper or use individual components (Viewport, GridBackground) independently.

## Installation

Install the package via your preferred package manager (ensure you have `pixi.js` version 8 installed as a peer dependency):

```bash
bun add @thani-sh/infinite-pixi pixi.js
```

## Quick Start

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

## API Reference

### `InfiniteCanvas`

Main entry wrapper to initialize the PIXI Application, instantiate the viewport camera, and setup the infinite tiling grid.

#### Options

| Option            | Type                    | Default     | Description                                |
| :---------------- | :---------------------- | :---------- | :----------------------------------------- |
| `backgroundAlpha` | `number`                | `0`         | Alpha value of the application background. |
| `backgroundColor` | `number`                | `0x000000`  | Background color code.                     |
| `minScale`        | `number`                | `0.1`       | Minimum zoom out scale limit.              |
| `maxScale`        | `number`                | `5`         | Maximum zoom in scale limit.               |
| `grid`            | `GridBackgroundOptions` | `see below` | Configuration options for grid background. |

#### Members

- `app: PIXI.Application | null`: Direct access to the underlying PixiJS application.
- `viewport: Viewport | null`: Camera container handling pans and zooms.
- `grid: GridBackground | null`: Instance of the grid background tiling sprite.
- `contentContainer: PIXI.Container | null`: Target layer where all custom graphics/nodes should be added.
- `init(container: HTMLElement): Promise<void>`: Bootstraps the application inside the target container.
- `resetViewport(): void`: Centers and resets the camera scale back to 1.
- `destroy(): void`: Cleans up tickers, elements, and event listeners.

---

### `Viewport`

A custom `PIXI.Container` class implementing scroll-to-zoom (relative to cursor coordinates) and drag-to-pan camera interactions.

```typescript
import { Viewport } from "@thani-sh/infinite-pixi";

const viewport = new Viewport(app, {
  minScale: 0.1,
  maxScale: 5,
});
app.stage.addChild(viewport);
```

---

### `GridBackground`

A custom `PIXI.TilingSprite` class that dynamically generates and renders tiling dot or line grids.

```typescript
import { GridBackground } from "@thani-sh/infinite-pixi";

const grid = new GridBackground(app, {
  type: "lines",
  color: 0xffffff,
  alpha: 0.05,
  size: 20,
  thickness: 1,
});

app.stage.addChild(grid);

// Keep grid synced with viewport transforms in your render loop/ticker
app.ticker.add(() => {
  grid.sync(viewport);
});
```

#### Grid Options

| Option      | Type                | Default    | Description                                              |
| :---------- | :------------------ | :--------- | :------------------------------------------------------- |
| `type`      | `"dots" \| "lines"` | `"dots"`   | Visual style of the grid background.                     |
| `color`     | `number`            | `0xffffff` | Color code of the grid.                                  |
| `alpha`     | `number`            | `0.075`    | Alpha transparency of the grid graphics.                 |
| `size`      | `number`            | `10`       | Spacing interval between grid dots/lines in pixels.      |
| `radius`    | `number`            | `1`        | Circle radius (only applicable if `type` is `"dots"`).   |
| `thickness` | `number`            | `1`        | Line thickness (only applicable if `type` is `"lines"`). |

## License

MIT
