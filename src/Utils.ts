import { useCallback, useState } from "react"

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Env {
  crnt: Point,
  next: Point,
  size: Size,
  code: number[][],
  dp: number,
  cc: number,
  block: Point[],
  stuck: number,
  stack: [],
  input: '',
  output: '',
  fillColor0: number,
}

export function isInCanvas(
  e: Env,
  x: number,
  y: number
): boolean {
  return 0 <= x && 0 <= y && x < e.size.w && y < e.size.h;
}

export const Colors = [
  "#ffc0c0", "#ff0000", "#c00000",
  "#ffffc0", "#ffff00", "#c0c000",
  "#c0ffc0", "#00ff00", "#00c000",
  "#c0ffff", "#00ffff", "#00c0c0",
  "#c0c0ff", "#0000ff", "#0000c0",
  "#ffc0ff", "#ff00ff", "#c000c0",
  "#ffffff", "#000000", "#ffc0c0"
]

export const Operations = [
  "*", "push", "pop",
  "add", "sub", "mul",
  "div", "mod", "not",
  "great", "point", "switch",
  "dup", "roll", "in(n)",
  "in(c)", "out(n)", "out(c)",
  "white", "black", ""
]

export function useForceUpdate() {
  const [ignored, newState] = useState({});
  return useCallback(() => newState({}), []);
}