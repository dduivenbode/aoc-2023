import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const exec = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");
  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

const getNumbers = (line: string): string[] => {
  return line
    .split(" ")
    .map(n => n.trim())
    .filter(n => n);
};

const getData = (input: string[]): Map<string, [string[], string[], number]> => {
  const data: Map<string, [string[], string[], number]> = new Map();
  for (const line of input) {
    let [card, numbers] = line.split(":");
    let [w, c] = numbers.split("|");
    data.set(card.replace(/\D/g, ""), [getNumbers(w), getNumbers(c), 1]);
  }
  return data;
};

const ex1 = (input: string[]): number => {
  const data = getData(input);
  const scores: number[] = [];
  for (const [wn, cn] of data.values()) {
    scores.push(
      cn
        .filter(n => wn.includes(n))
        .reduce(prev => {
          if (prev === 0) {
            return 1;
          } else {
            return prev * 2;
          }
        }, 0)
    );
  }
  return scores.reduce((total, value) => (total += value));
};

const ex2 = (input: string[]): number => {
  const data = getData(input);
  let no_of_cards: number[] = [];
  for (const [key, [wn, cn, n_o_cards]] of data) {
    let i = parseInt(key) + 1;
    cn.filter(n => wn.includes(n)).map(() => {
      let old = data.get(String(i));
      if (old) {
        old[2] = old[2] + n_o_cards;
        data.set(String(i), old);
      }
      i++;
    });
  }

  for (const v of data.values()) {
    no_of_cards.push(v[2]);
  }
  return no_of_cards.reduce((total, value) => (total += value));
};
