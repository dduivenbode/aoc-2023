import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const day9 = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");

  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

const getNextEntry = (history: number[]): number => {
  const ep: number[][] = [];
  ep.push(history);
  for (const i of history.keys()) {
    if (ep[ep.length - 1].every(n => n === 0)) {
      ep[ep.length - 1].push(0);
      break;
    } else {
      ep.push(getSequence(ep[ep.length - 1]));
    }
  }

  for (let i = ep.length - 2; i > -1; i--) {
    ep[i].push(ep[i][ep[i].length - 1] + ep[i + 1][ep[i + 1].length - 1]);
  }

  return ep[0][ep[0].length - 1];
};

const getPreviousEntry = (history: number[]): number => {
  const ep: number[][] = [];
  ep.push(history);
  for (const i of history.keys()) {
    if (ep[ep.length - 1].every(n => n === 0)) {
      ep[ep.length - 1].unshift(0);
      break;
    } else {
      ep.push(getSequence(ep[ep.length - 1]));
    }
  }

  for (let i = ep.length - 2; i > -1; i--) {
    ep[i].unshift(ep[i][0] - ep[i + 1][0]);
  }

  return ep[0][0];
};

const getSequence = (history: number[]): number[] => {
  return history.reduce((acc, curr, i) => {
    if (i < history.length - 1) {
      acc.push(history[i + 1] - history[i]);
    }
    return acc;
  }, new Array<number>());
};

const ex1 = (input: string[]): number => {
  const data = input.map(l => l.split(" ").map(n => parseInt(n)));
  return data.map(getNextEntry).reduce((t, c) => t + c, 0);
};

const ex2 = (input: string[]): number => {
  const data = input.map(l => l.split(" ").map(n => parseInt(n)));
  return data.map(getPreviousEntry).reduce((t, c) => t + c, 0);
};
