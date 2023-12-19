import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const day16 = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");

  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

type Cell = {
  pos: number;
  x: number;
  y: number;
  value: string;
  visited: boolean;
  dir: string[];
};

const get_tiles_for_grid = (x: number, y: number, dir: string, input: string[], total = 0): number => {
  const grid: Map<number, Cell> = new Map();

  for (const [y, line] of input.entries()) {
    for (let x = 0; x < line.length; x++) {
      let pos = y * line.length + x;
      grid.set(y * line.length + x, { pos, x, y, value: line[x], visited: false, dir: [] });
    }
  }

  let width = input[0].length;
  let length = input.length;

  const traverse_grid = (x: number, y: number, dir: string): void => {
    if (x < 0 || x > width - 1 || y < 0 || y > length - 1) {
      //beam is out of the cave
    } else {
      let pos = y * width + x;
      let cell = grid.get(pos);

      if (cell) {
        cell.visited = true;
        if (!cell.dir.includes(dir)) {
          cell.dir.push(dir);

          if (dir === "Right") {
            if (cell.value === "." || cell.value === "-") {
              traverse_grid(x + 1, y, dir);
            }
            if (cell.value === "/" || cell.value === "|") {
              traverse_grid(x, y - 1, "Up");
            }
            if (cell.value === "\\" || cell.value === "|") {
              traverse_grid(x, y + 1, "Down");
            }
          } else if (dir === "Down") {
            if (cell.value === "." || cell.value === "|") {
              traverse_grid(x, y + 1, dir);
            }
            if (cell.value === "/" || cell.value === "-") {
              traverse_grid(x - 1, y, "Left");
            }
            if (cell.value === "\\" || cell.value === "-") {
              traverse_grid(x + 1, y, "Right");
            }
          } else if (dir === "Left") {
            if (cell.value === "." || cell.value === "-") {
              traverse_grid(x - 1, y, dir);
            }
            if (cell.value === "/" || cell.value === "|") {
              traverse_grid(x, y + 1, "Down");
            }
            if (cell.value === "\\" || cell.value === "|") {
              traverse_grid(x, y - 1, "Up");
            }
          } else {
            if (cell.value === "." || cell.value === "|") {
              traverse_grid(x, y - 1, dir);
            }
            if (cell.value === "/" || cell.value === "-") {
              traverse_grid(x + 1, y, "Right");
            }
            if (cell.value === "\\" || cell.value === "-") {
              traverse_grid(x - 1, y, "Left");
            }
          }
        }
      }
    }
  };

  traverse_grid(x, y, dir);
  return Array.from(grid).filter(c => c[1].visited).length;
};

const ex1 = (input: string[]): number => {
  return get_tiles_for_grid(0, 0, "Right", input);
};

const ex2 = (input: string[]): number => {
  const lines: number[] = [];

  for (const [y, line] of input.entries()) {
    for (let x = 0; x < line.length; x++) {
      if (x === 0 && y === 0) {
        lines.push(Math.max(get_tiles_for_grid(x, y, "Right", input), get_tiles_for_grid(x, y, "Down", input)));
      } else if (x === input[0].length - 1 && y === 0) {
        lines.push(Math.max(get_tiles_for_grid(x, y, "Left", input), get_tiles_for_grid(x, y, "Down", input)));
      } else if (x === input[0].length - 1 && y === input.length - 1) {
        lines.push(Math.max(get_tiles_for_grid(x, y, "Up", input), get_tiles_for_grid(x, y, "Left", input)));
      } else if (x === 0 && y === input.length - 1) {
        lines.push(Math.max(get_tiles_for_grid(x, y, "Up", input), get_tiles_for_grid(x, y, "Right", input)));
      } else if (x === 0) {
        lines.push(get_tiles_for_grid(x, y, "Right", input));
      } else if (y === 0) {
        lines.push(get_tiles_for_grid(x, y, "Down", input));
      } else if (x === input[0].length - 1) {
        lines.push(get_tiles_for_grid(x, y, "Left", input));
      } else if (y === input.length - 1) {
        lines.push(get_tiles_for_grid(x, y, "Up", input));
      }
    }
  }

  return lines.reduce((a, b) => Math.max(a, b));
};
