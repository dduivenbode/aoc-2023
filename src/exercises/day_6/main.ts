import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const day6 = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");
  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

type Race = {
  time: number;
  distance: number;
};

const getData1 = (input: string[]): Race[] => {
  const data: Race[] = [];
  const time = input[0]
    .split(":")[1]
    .split(" ")
    .filter(n => n)
    .map(n => parseInt(n));
  const dist = input[1]
    .split(":")[1]
    .split(" ")
    .filter(n => n)
    .map(n => parseInt(n));
  for (let i = 0; i < time.length; i++) {
    data.push({ time: time[i], distance: dist[i] });
  }
  return data;
};

const getData2 = (input: string[]): Race => {
  return { time: parseInt(input[0].split(":")[1].replace(/ /g, "")), distance: parseInt(input[1].split(":")[1].replace(/ /g, "")) };
};

const ex1 = (input: string[]): number => {
  const races = getData1(input);
  let power = 1;
  for (const r of races) {
    power =
      power *
      Array.from({ length: r.time + 1 }).filter((k, v) => {
        return (r.time - v) * v > r.distance;
      }).length;
  }
  return power;
};

const ex2 = (input: string[]): number => {
  const race = getData2(input);
  return Array.from({ length: race.time + 1 }).filter((k, v) => {
    return (race.time - v) * v > race.distance;
  }).length;
};
