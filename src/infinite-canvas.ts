import * as PIXI from "pixi.js";
import { Viewport } from "./viewport.js";
import {
  GridBackground,
  type GridBackgroundOptions,
} from "./grid-background.js";

/**
 * InfiniteCanvasOptions represents the configuration options for the InfiniteCanvas class.
 */
export interface InfiniteCanvasOptions {
  backgroundAlpha?: number;
  backgroundColor?: number;
  minScale?: number;
  maxScale?: number;
  grid?: GridBackgroundOptions;
}

/**
 * InfiniteCanvas bootstraps a PIXI Application inside a container element,
 * instantiates a zooming/panning Viewport, and maintains an infinite tiling grid background.
 */
export class InfiniteCanvas {
  public app: PIXI.Application | null = null;
  public viewport: Viewport | null = null;
  public grid: GridBackground | null = null;
  public contentContainer: PIXI.Container | null = null;

  private container: HTMLElement | null = null;
  private options: Required<Omit<InfiniteCanvasOptions, "grid">> & {
    grid?: GridBackgroundOptions;
  };

  constructor(options?: InfiniteCanvasOptions) {
    this.options = {
      backgroundAlpha: options?.backgroundAlpha ?? 0,
      backgroundColor: options?.backgroundColor ?? 0x000000,
      minScale: options?.minScale ?? 0.1,
      maxScale: options?.maxScale ?? 5,
      grid: options?.grid,
    };
  }

  /**
   * init initializes the PIXI application and viewport, attaching the canvas to the container.
   */
  public async init(container: HTMLElement): Promise<void> {
    this.container = container;
    this.app = new PIXI.Application();

    await this.app.init({
      resizeTo: container,
      backgroundAlpha: this.options.backgroundAlpha,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
      roundPixels: false,
    });

    container.appendChild(this.app.canvas);

    this.viewport = new Viewport(this.app, {
      minScale: this.options.minScale,
      maxScale: this.options.maxScale,
    });

    this.contentContainer = new PIXI.Container();
    this.viewport.addChild(this.contentContainer);

    const gridOptions: GridBackgroundOptions = this.options.grid ?? {
      color: 0xffffff,
      alpha: 0.075,
      size: 10,
      radius: 1,
      type: "dots",
    };
    this.grid = new GridBackground(this.app, gridOptions);

    this.app.stage.addChild(this.grid);
    this.app.stage.addChild(this.viewport);

    // Center the viewport initially
    const rect: DOMRect = container.getBoundingClientRect();
    this.viewport.x = rect.width / 2;
    this.viewport.y = rect.height / 2;

    this.app.ticker.add(this.tick, this);
  }

  private tick(): void {
    if (!this.app || !this.grid || !this.viewport) return;
    this.grid.sync(this.viewport);
  }

  /**
   * resetViewport resets the viewport transformation (zoom and offset).
   */
  public resetViewport(): void {
    if (!this.viewport || !this.app) return;
    const rect: DOMRect | undefined = this.container?.getBoundingClientRect();
    this.viewport.x = rect ? rect.width / 2 : this.app.screen.width / 2;
    this.viewport.y = rect ? rect.height / 2 : this.app.screen.height / 2;
    this.viewport.scale.set(1);
  }

  /**
   * destroy cleans up events and destroys the PIXI application.
   */
  public destroy(): void {
    if (this.app) {
      this.app.ticker.remove(this.tick, this);
    }
    this.viewport?.destroy();
    this.grid?.destroy();
    this.app?.destroy();
  }
}
