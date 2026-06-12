import { expect, test } from "bun:test";
import { InfiniteCanvas, Viewport, GridBackground } from "./index.js";

test("exports InfiniteCanvas, Viewport, and GridBackground", () => {
  expect(InfiniteCanvas).toBeDefined();
  expect(Viewport).toBeDefined();
  expect(GridBackground).toBeDefined();
});

test("InfiniteCanvas can be constructed with custom options", () => {
  const canvas = new InfiniteCanvas({
    backgroundColor: 0x222222,
    grid: {
      type: "lines",
      color: 0x00ff00,
      thickness: 2,
      size: 30,
    },
  });
  expect(canvas).toBeDefined();
});
