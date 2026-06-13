# Advanced Usage Guide

This document covers advanced configuration, alternative setups, and the complete API reference for `@thani-sh/infinite-pixi`.

Designed with SOLID principles and modular abstractions, `@thani-sh/infinite-pixi` allows you to either use the high-level `InfiniteCanvas` bootstrap wrapper or assemble the individual components (`Viewport`, `GridBackground`) independently for fine-grained control.

---

## Alternative Setup: Independent Components

If you already have a custom PixiJS application setup and only want to use specific parts of the library, you can instantiate the viewport and grid separately.

### Viewport Only

The `Viewport` is a custom `PIXI.Container` class implementing scroll-to-zoom (relative to cursor coordinates) and drag-to-pan camera interactions.

```typescript
import { Viewport } from "@thani-sh/infinite-pixi";
import * as PIXI from "pixi.js";

const app = new PIXI.Application();
await app.init({ resizeTo: window });
document.body.appendChild(app.canvas);

const viewport = new Viewport(app, {
  minScale: 0.1,
  maxScale: 5,
});

app.stage.addChild(viewport);
```

### Grid Background Only

The `GridBackground` is a custom `PIXI.TilingSprite` class that dynamically generates and renders tiling dot or line grids.

To keep the grid aligned and scaled correctly, you must sync it with the viewport inside your render loop or ticker.

```typescript
import { Viewport, GridBackground } from "@thani-sh/infinite-pixi";
import * as PIXI from "pixi.js";

const app = new PIXI.Application();
await app.init({ resizeTo: window });
document.body.appendChild(app.canvas);

const viewport = new Viewport(app, { minScale: 0.1, maxScale: 5 });
const grid = new GridBackground(app, {
  type: "lines",
  color: 0xffffff,
  alpha: 0.05,
  size: 20,
  thickness: 1,
});

app.stage.addChild(grid);
app.stage.addChild(viewport);

// Sync the grid offset and scale with the viewport transform
app.ticker.add(() => {
  grid.sync(viewport);
});
```

---

## API Reference

### InfiniteCanvas

Main entry wrapper to initialize the PixiJS Application, instantiate the viewport camera, and setup the infinite tiling grid.

#### Options (`InfiniteCanvasOptions`)

| Option            | Type                    | Default     | Description                                |
| :---------------- | :---------------------- | :---------- | :----------------------------------------- |
| `backgroundAlpha` | `number`                | `0`         | Alpha value of the application background. |
| `backgroundColor` | `number`                | `0x000000`  | Background color code.                     |
| `minScale`        | `number`                | `0.1`       | Minimum zoom out scale limit.              |
| `maxScale`        | `number`                | `5`         | Maximum zoom in scale limit.               |
| `grid`            | `GridBackgroundOptions` | _See below_ | Configuration options for grid background. |

#### Members & Methods

- `app: PIXI.Application | null`
  Direct access to the underlying PixiJS application.
- `viewport: Viewport | null`
  Camera container handling pans and zooms.
- `grid: GridBackground | null`
  Instance of the grid background tiling sprite.
- `contentContainer: PIXI.Container | null`
  Target layer where all custom graphics/nodes should be added.
- `init(container: HTMLElement): Promise<void>`
  Bootstraps the application inside the target container.
- `resetViewport(): void`
  Centers the viewport and resets the camera scale back to 1.
- `destroy(): void`
  Cleans up tickers, elements, and event listeners.

---

### Viewport

A custom `PIXI.Container` handling camera transformations.

#### Options

| Option     | Type     | Default | Description         |
| :--------- | :------- | :------ | :------------------ |
| `minScale` | `number` | `0.1`   | Minimum zoom scale. |
| `maxScale` | `number` | `5.0`   | Maximum zoom scale. |

#### Methods

- `destroy(options?: PIXI.DestroyOptions): void`
  Cleans up registered event listeners (such as the native `wheel` event handler on the canvas) and ticker tasks before destroying the container.

---

### GridBackground

A custom `PIXI.TilingSprite` rendering an infinite grid.

#### Options (`GridBackgroundOptions`)

| Option      | Type                | Default    | Description                                              |
| :---------- | :------------------ | :--------- | :------------------------------------------------------- |
| `type`      | `"dots" \| "lines"` | `"dots"`   | Visual style of the grid background.                     |
| `color`     | `number`            | `0xffffff` | Color code of the grid.                                  |
| `alpha`     | `number`            | `0.075`    | Alpha transparency of the grid graphics.                 |
| `size`      | `number`            | `10`       | Spacing interval between grid dots/lines in pixels.      |
| `radius`    | `number`            | `1`        | Circle radius (only applicable if `type` is `"dots"`).   |
| `thickness` | `number`            | `1`        | Line thickness (only applicable if `type` is `"lines"`). |

#### Methods

- `sync(viewport: PIXI.Container): void`
  Aligns the tiling grid offset and scale to match the target viewport transformation.

---

## Advanced Grid Customization

### Dots Grid vs Lines Grid

Here is how you configure the two visual styles using the `grid` option on `InfiniteCanvas`:

#### Grid of Dots (Default)

```typescript
const infiniteCanvas = new InfiniteCanvas({
  grid: {
    type: "dots",
    color: 0x3b82f6, // Blue dots
    alpha: 0.15,
    size: 20, // 20px spacing
    radius: 2, // 2px dot radius
  },
});
```

#### Grid of Lines

```typescript
const infiniteCanvas = new InfiniteCanvas({
  grid: {
    type: "lines",
    color: 0x10b981, // Emerald lines
    alpha: 0.08,
    size: 40, // 40px grid spacing
    thickness: 1, // 1px line width
  },
});
```

---

## Lifecycle & Cleanup

To prevent memory leaks in Single Page Applications (SPAs) or interactive components, always make sure to call `destroy()` when the component is unmounted or removed from the DOM:

```typescript
// When done with the canvas instance
infiniteCanvas.destroy();
```
