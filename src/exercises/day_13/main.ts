import { split_at_space } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const result: Map<number, string> = new Map();

export const day13 = (): void => {
  // let input = split_at_space(__dirname, "input_sample.txt").map(g => g.split("\n"));
  let input = split_at_space(__dirname, "input.txt").map(g => g.split("\n"));
  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

const check_horizontal = (grid: string[], grid_no: number, dir: string = "H", ex = 1): number => {
  let a = [0, 0];
  let b = [0, 0];
  for (let i = 0; i < grid.length - 1; i++) {
    if (grid[i] === grid[i + 1]) {
      if (grid.length - i > Math.ceil(grid.length / 2)) {
        a = [0, i + 1];
        b = [i + 1, i + i + 2];
      } else {
        a = [i + 1 - (grid.length - (i + 1)), i + 1];
        b = [i + 1, grid.length];
      }
      let part1 = grid.slice(a[0], a[1]).reverse();
      let part2 = grid.slice(b[0], b[1]);
      if (JSON.stringify(part1) === JSON.stringify(part2)) {
        if (ex === 1) {
          // during exercise 1 we save the found reflection point
          result.set(grid_no, dir + i);
          return i + 1;
        } else {
          // if the same, this is the result found in ex.1
          if (result.get(grid_no) !== dir + i) {
            return i + 1;
          }
        }
      }
    }
  }
  return 0;
};

const check_vertical = (grid: string[], grid_no: number, ex = 1): number => {
  const f_grid = flip_grid(grid);
  return check_horizontal(f_grid, grid_no, "V", ex);
};

const flip_grid = (grid: string[]): string[] => {
  let f_grid: string[] = Array(grid[0].length).fill("");
  for (const [k, line] of grid.entries()) {
    line.split("").map((c, i) => {
      return (f_grid[i] += c);
    });
  }
  return f_grid;
};

const ex1 = (input: string[][], total = 0): number => {
  for (const [i, grid] of input.entries()) {
    let rows = check_horizontal(grid, i);
    let cols = rows ? 0 : check_vertical(grid, i);

    total += (rows ? rows : 0) * 100 + (cols ? cols : 0);
  }
  return total;
};

const ex2 = (input: string[][], total = 0): number => {
  for (const [z, grid] of input.entries()) {
    let rows = 0,
      cols = 0;
    for (const [i, line] of grid.entries()) {
      const org_string = line;
      for (let n = 0; n < line.length; n++) {
        grid[i] = replace_char_at_index(org_string, n, line[n] === "#" ? "." : "#");
        rows = check_horizontal(grid, z, "H", 2);
        cols = rows ? 0 : check_vertical(grid, z, 2);
        if (rows || cols) {
          total += (rows ? rows : 0) * 100 + (cols ? cols : 0);
          break;
        }
        grid[i] = org_string;
      }
      if (rows || cols) {
        break;
      }
    }
  }

  return total;
};

const replace_char_at_index = (str: string, index: number, c: string): string => {
  return str.substring(0, index) + c + str.substring(index + 1);
};
