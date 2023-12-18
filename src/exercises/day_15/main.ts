import { getInputPlain } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type Ins = {
  label: string;
  op: string;
  focal?: number;
};

type Lens = {
  label: string;
  focal: number;
};

export const day15 = (): void => {
  // let input = getInputPlain(__dirname, "input_sample.txt").split(",");
  let input = getInputPlain(__dirname, "input.txt").split(",");
  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

const increase_value = (char: string, sum: number): number => {
  let ac = char.charCodeAt(0);
  sum += ac;
  sum = sum * 17;
  return sum % 256;
};

const ex1 = (input: string[], total = 0): number => {
  for (const step of input) {
    let value = 0;
    for (let i = 0; i < step.length; i++) {
      value = increase_value(step[i], value);
    }
    total += value;
  }

  return total;
};

const get_box = (str: string, sum = 0): number => {
  for (let i = 0; i < str.length; i++) {
    sum = increase_value(str[i], sum);
  }
  return sum;
};

const fill_boxes = (instructions: Ins[]): Lens[][] => {
  const boxes: Lens[][] = [];
  for (let i = 0; i < 256; i++) {
    boxes.push([]);
  }

  for (const ins of instructions) {
    let box = get_box(ins.label);
    let lens_index = boxes[box].findIndex(lens => lens.label === ins.label);
    if (ins.op === "=") {
      let lens: Lens = { label: ins.label, focal: ins.focal! };
      if (lens_index > -1) {
        boxes[box].splice(lens_index, 1, lens);
      } else {
        boxes[box].push(lens);
      }
    } else {
      if (lens_index > -1) {
        boxes[box].splice(lens_index, 1);
      }
    }
  }
  return boxes;
};

const ex2 = (input: string[], total = 0): number => {
  const instructions: Ins[] = input.map(str => {
    if (str.indexOf("-") > -1) {
      return { label: str.split("-")[0], op: "-" };
    } else {
      let [l, f] = str.split("=");
      return { label: l, focal: parseInt(f), op: "=" };
    }
  });

  const boxes = fill_boxes(instructions);

  for (const [i, v] of boxes.entries()) {
    for (const [n, l] of boxes[i].entries()) {
      total += (i + 1) * (n + 1) * l.focal;
    }
  }

  return total;
};
