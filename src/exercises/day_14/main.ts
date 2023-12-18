import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const day14 = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");
  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

const rotate_left = (grid: string[]): string[] => {
  let r_grid: string[] = Array(grid[0].length).fill("");
  for (const line of grid) {
    line
      .split("")
      .reverse()
      .map((c, i) => {
        return (r_grid[i] += c);
      });
  }
  return r_grid;
};

const rotate_right = (grid: string[]): string[] => {
  let r_grid: string[] = Array(grid[0].length).fill("");
  grid = grid.reverse();
  for (const line of grid) {
    line.split("").map((c, i) => {
      return (r_grid[i] += c);
    });
  }
  return r_grid;
};

const tilt_line = (line: string): string => {
  let new_line = "";
  let c = 0;
  let i = 0;
  let suff = "";
  while (c < line.length) {
    i = line.indexOf("#", c);
    if (i > -1) {
      suff = "#";
    } else {
      i = line.length;
      suff = "";
    }
    let temp_line = line.slice(c, i).replaceAll(".", "");
    temp_line += ".".repeat(i - (temp_line.length + c));

    new_line += temp_line + suff;
    c = i + 1;
  }
  return new_line;
};

const determine_load = (line: string): number => {
  let total = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "O") {
      total += line.length - i;
    }
  }
  return total;
};

const ex1 = (input: string[]): number => {
  return rotate_left(input)
    .map(tilt_line)
    .map(determine_load)
    .reduce((total, value) => total + value, 0);
};

const ex2 = (input: string[]): number => {
  let grid = input;
  let loads: number[] = [];

  //first north
  grid = rotate_left(grid).map(tilt_line);

  //do n times to generate a pattern
  for (let i = 0; i < 5000; i++) {
    // west
    grid = rotate_right(grid).map(tilt_line);
    // south
    grid = rotate_right(grid).map(tilt_line);
    // east
    grid = rotate_right(grid).map(tilt_line);
    // north
    grid = rotate_right(grid);
    loads.push(grid.map(determine_load).reduce((total, value) => total + value, 0));
    grid = grid.map(tilt_line);
  }

  let factor = determine_repetition_factor(loads);
  let pos = 1000000000 % factor;

  //throw away the beginning
  loads.splice(0, 200 * factor - 1);
  return loads[pos];
};

const determine_repetition_factor = (loads: number[]): number => {
  return 22;
};
