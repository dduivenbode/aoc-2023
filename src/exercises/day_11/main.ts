import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const day11 = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");
  solve(input);
};

type Expansion = {
  rows: number[];
  cols: number[];
};

type Node = {
  x: number;
  y: number;
};

const solve = (input: string[]): void => {
  const expansion = get_expansion(input);
  const grid = input.map(l => l.split(""));
  const universe = get_universe(grid);
  const galaxies = get_galaxies(grid);

  console.log(chalk.blue(`1: ${get_sum_of_paths(universe, galaxies, expansion)}`));
  console.log(chalk.blue(`2: ${get_sum_of_paths(universe, galaxies, expansion, 1000000)}`));
};

const get_sum_of_paths = (universe: Node[], galaxies: number[], expansion: Expansion, factor?: number): number => {
  let sum = 0;
  for (const [i, g] of galaxies.entries()) {
    let n = i + 1;
    while (n < galaxies.length) {
      sum += get_distance_between_galaxies(universe[g], universe[galaxies[n]], expansion, factor || null);
      n++;
    }
  }
  return sum;
};

const get_distance_between_galaxies = (from: Node, to: Node, expansion: Expansion, factor?: number | null): number => {
  const c_ex = expansion.cols.filter(x => x > Math.min(from.x, to.x) && x < Math.max(from.x, to.x)).length;
  const r_ex = expansion.rows.filter(y => y > Math.min(from.y, to.y) && y < Math.max(from.y, to.y)).length;
  if (factor) {
    return Math.abs(to.y - from.y) + Math.abs(to.x - from.x) + (c_ex * factor - r_ex) + (r_ex * factor - c_ex);
  } else {
    return Math.abs(to.y - from.y) + Math.abs(to.x - from.x) + c_ex + r_ex;
  }
};

const get_galaxies = (grid: string[][]): number[] => {
  const galaxies: number[] = [];
  for (const [y, line] of grid.entries()) {
    for (const [x, value] of line.entries()) {
      if (value === "#") {
        galaxies.push(y * grid[0].length + x);
      }
    }
  }
  return galaxies;
};

const get_universe = (grid: string[][]): Node[] => {
  let uni = Array(grid.length * grid[0].length).fill(null);
  for (const [y, line] of grid.entries()) {
    for (const [x, value] of line.entries()) {
      uni[y * grid[0].length + x] = { x, y };
    }
  }
  return uni;
};

const get_expansion = (input: string[]): Expansion => {
  const data: Expansion = {
    rows: [],
    cols: []
  };

  for (const [k, line] of input.entries()) {
    if (line.indexOf("#") < 0) {
      data.rows.push(k);
    }
  }

  for (let i = 0; i < input[0].length; i++) {
    const col = Array(input.length)
      .fill(null)
      .map((_, k) => {
        return input[k][i];
      });
    if (col.every(c => c === ".")) {
      data.cols.push(i);
    }
  }

  return data;
};
