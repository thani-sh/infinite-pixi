import * as PIXI from "pixi.js";

/**
 * GridBackgroundOptions represents the configuration options for the GridBackground class.
 */
export interface GridBackgroundOptions {
  color?: number;
  alpha?: number;
  size?: number;
  radius?: number;
  thickness?: number;
  type?: "dots" | "lines";
}

/**
 * GridBackground is a PIXI.TilingSprite subclass that generates and renders
 * an infinite tiling grid background aligned with a viewport.
 */
export class GridBackground extends PIXI.TilingSprite {
  private readonly gridOptions: Required<GridBackgroundOptions>;

  constructor(
    private readonly app: PIXI.Application,
    options?: GridBackgroundOptions,
  ) {
    const gridOptions: Required<GridBackgroundOptions> = {
      color: options?.color ?? 0xffffff,
      alpha: options?.alpha ?? 0.075,
      size: options?.size ?? 10,
      radius: options?.radius ?? 1,
      thickness: options?.thickness ?? 1,
      type: options?.type ?? "dots",
    };

    const texture: PIXI.Texture = GridBackground.generateTexture(
      app,
      gridOptions,
    );

    super({
      texture,
      width: app.screen.width,
      height: app.screen.height,
    });

    this.gridOptions = gridOptions;
  }

  private static generateTexture(
    app: PIXI.Application,
    options: Required<GridBackgroundOptions>,
  ): PIXI.Texture {
    const size: number = options.size;
    const tileG: PIXI.Graphics = new PIXI.Graphics();

    tileG.rect(0, 0, size, size).fill({ color: 0x000000, alpha: 0 });

    if (options.type === "dots") {
      tileG
        .circle(size / 2, size / 2, options.radius)
        .fill({ color: options.color, alpha: options.alpha });
    } else {
      tileG
        .rect(0, 0, size, options.thickness)
        .fill({ color: options.color, alpha: options.alpha });
      tileG
        .rect(0, 0, options.thickness, size)
        .fill({ color: options.color, alpha: options.alpha });
    }

    return app.renderer.generateTexture(tileG);
  }

  /**
   * sync aligns the tiling grid offset and scale to match the target viewport transformation.
   */
  public sync(viewport: PIXI.Container): void {
    this.width = this.app.screen.width;
    this.height = this.app.screen.height;
    this.tileScale.set(viewport.scale.x);
    this.tilePosition.set(viewport.x, viewport.y);
  }
}
