import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type Node = {
  x: number;
  y: number;
  i: number;
  main_loop: boolean;
  value: string;
  enclosed?: boolean;
  fake: boolean;
};

const pipe_map = {
  "|": { N: "N", S: "S" },
  "-": { E: "E", W: "W" },
  L: { S: "E", W: "N" },
  J: { E: "N", S: "W" },
  "7": { E: "S", N: "W" },
  F: { N: "E", W: "S" }
};

const graph: Map<number, Node> = new Map();
const l_graph: Map<number, Node> = new Map();
let GRAPH_WIDTH: number = 0;
let GRAPH_LENGTH: number = 0;
let visited: Array<boolean> = [];

export const day10 = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");

  solve(input);
};

const get_start = (grid: string[][]): [number, number] => {
  let start: [number, number];
  for (const [y, line] of grid.entries()) {
    for (const [x, value] of line.entries()) {
      let i = line.length * y + x;
      let node = { x, y, i, value, main_loop: false, enclosed: false, fake: false };
      graph.set(i, node);

      if (value === "S") {
        start = [x, y];
      }
    }
  }
  return start!;
};

const walk_pipe = (grid: string[][], start: [number, number], direction: string): number => {
  let value: string;
  let [x, y] = start;
  let i = 0;
  while (true) {
    let pos = y * grid[0].length + x;
    let node = graph.get(pos);
    node!.main_loop = true;
    graph.set(node!.i, node!);

    if (direction === "N") {
      value = grid[y - 1][x];
      y--;
    } else if (direction === "S") {
      value = grid[y + 1][x];
      y++;
    } else if (direction === "E") {
      value = grid[y][x + 1];
      x++;
    } else {
      value = grid[y][x - 1];
      x--;
    }
    i++;
    if (value === "S") {
      break;
    }
    direction = pipe_map[value][direction];
  }
  return i;
};

const create_enlarged_graph = (x: number, y: number, grid: string[][]): void => {
  let start_pos = y * GRAPH_WIDTH + x;
  let start_node = graph.get(start_pos);
  if (start_node) {
    start_node.value = "7";
    graph.set(start_node.i, start_node);
  }

  let n = 0;
  let yi = 0;
  for (const [y, line] of grid.entries()) {
    const new_line: string[] = [];
    let xi = 0;
    let str = "";
    for (const [x, value] of line.entries()) {
      let i = line.length * y + x;
      let org_node = Object.assign({}, graph.get(i));
      if (org_node) {
        org_node.x = xi;
        org_node.y = yi;
        org_node.i = n;
        l_graph.set(n, org_node);
        n++;
        xi++;
        new_line.push(org_node.value);
        str += org_node.value;
        if (x < GRAPH_WIDTH - 1) {
          let new_node = Object.assign({}, org_node);
          new_node.fake = true;
          new_node.i = n;
          new_node.x = xi;
          new_node.y = yi;
          if (org_node.main_loop && pipe_map[org_node.value].hasOwnProperty("W")) {
            new_node.value = "-";
          } else {
            new_node.value = ".";
            new_node.main_loop = false;
          }
          l_graph.set(n, new_node);
          n++;
          xi++;
          new_line.push(new_node.value);
          str += new_node.value;
        }
      }
    }
    // console.log(str);
    str = "";
    if (y < GRAPH_LENGTH - 1) {
      yi++;
      for (const z of new_line.keys()) {
        let org_node = Object.assign({}, l_graph.get(n - (GRAPH_WIDTH * 2 - 1)));
        if (org_node) {
          let new_node = Object.assign({}, org_node);
          new_node.fake = true;
          new_node.i = n;
          new_node.y = yi;
          new_node.x = z;
          if (org_node.main_loop && pipe_map[org_node.value].hasOwnProperty("N")) {
            new_node.value = "|";
          } else {
            new_node.value = ".";
            new_node.main_loop = false;
          }
          l_graph.set(n, new_node);
          str += new_node.value;
          n++;
        }
      }
      yi++;
    }
  }
};

const solve = (input: string[]): void => {
  const grid = input.map(l => l.split(""));
  GRAPH_LENGTH = grid.length;
  GRAPH_WIDTH = grid[0].length;
  const [x, y] = get_start(grid);
  const pipe_length = walk_pipe(grid, [x, y], "S");
  console.log(chalk.blue(`1: ${Math.ceil(pipe_length / 2)}`));

  //enlarge graph for pipe squeezing
  create_enlarged_graph(x, y, grid);
  GRAPH_LENGTH = GRAPH_LENGTH * 2 - 1;
  GRAPH_WIDTH = GRAPH_WIDTH * 2 - 1;

  visited = new Array(l_graph.size);
  for (let i = 0; i < l_graph.size; i++) {
    visited[i] = l_graph.get(i)?.main_loop ? true : false;
  }

  while (visited.findIndex(n => n === false) > -1) {
    //get first unexamined node
    let pos = visited.findIndex(n => n === false);
    let area: number[] = [];
    //get all nodes that are reachable from here
    const queue: number[] = [];

    queue.push(pos);
    visited[pos] = true;
    while (queue.length > 0) {
      pos = queue[0];
      //keep track of area
      area.push(pos);
      queue.shift();

      const adj = get_adjacent(pos);
      for (const v of adj) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
        }
      }
    }

    // set all nodes of this area enclosed or not
    let enclosed = true;
    for (const n of area) {
      let node = l_graph.get(n);
      if (node!.y === 0 || node!.y === GRAPH_LENGTH - 1 || node!.x === 0 || node!.x === GRAPH_WIDTH - 1) {
        enclosed = false;
        break;
      }
    }

    if (enclosed) {
      for (const n of area) {
        let node = l_graph.get(n);
        node!.enclosed = true;
        l_graph.set(node!.i, node!);
      }
    }
  }

  let sum: number = 0;
  for (const [k, v] of l_graph.entries()) {
    if (v.enclosed && !v.fake) {
      sum++;
    }
  }
  console.log(chalk.blue(`2: ${sum}`));
};

const get_adjacent = (pos: number): number[] => {
  const adj: number[] = [];
  const node = l_graph.get(pos);
  if (node!.y > 0) {
    adj.push(pos - GRAPH_WIDTH);
  }
  if (node!.y < GRAPH_LENGTH - 1) {
    adj.push(pos + GRAPH_WIDTH);
  }
  if (node!.x > 0) {
    adj.push(pos - 1);
  }
  if (node!.x < GRAPH_WIDTH - 1) {
    adj.push(pos + 1);
  }
  return adj;
};
