import { getInput } from "../../util/file.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const get_first_digit = (line: string): string | undefined => {
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (!isNaN(parseInt(char))) {
      return char;
    }
  }
};

const get_last_digit = (line: string): string | undefined => {
  for (let i = line.length - 1; i >= 0; i--) {
    const char = line[i];
    if (!isNaN(parseInt(char))) {
      return char;
    }
  }
};

const findfirstandlast = (input: string): number => {
  const digitsMap: { [key: string]: string } = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9"
  };
  const digits = ["one", "1", "two", "2", "three", "3", "four", "4", "five", "5", "six", "6", "seven", "7", "eight", "8", "nine", "9"];

  let first, second;

  let n = Infinity,
    i;
  for (const value of digits) {
    i = input.indexOf(value);
    if (i > -1 && i < n) {
      n = i;
      first = value;
    }
  }

  if (isNaN(parseInt(first!))) {
    first = digitsMap[first!];
  }

  n = -1;
  for (const value of digits) {
    i = input.lastIndexOf(value);
    if (i > -1 && i > n) {
      n = i;
      second = value;
    }
  }

  if (isNaN(parseInt(second!))) {
    second = digitsMap[second!];
  }

  return Number(`${first}${second}`);
};

const ex1 = (): number => {
  // const result = getInput(__dirname, "input_sample.txt");
  const result = getInput(__dirname, "input.txt");

  let total = 0;

  for (let n = 0; n < result.length; n++) {
    const line = result[n];
    let first = get_first_digit(line);
    let last = get_last_digit(line);

    total += Number(`${first}${last}`);
  }
  return total;
};

const ex2 = (): number => {
  const numbers = [{ zero: 0 }];

  // const result = getInput(__dirname, "input_sample.txt");
  const result = getInput(__dirname, "input.txt");

  let total = 0;

  for (let n = 0; n < result.length; n++) {
    const line = result[n];
    total += findfirstandlast(result[n]);
  }
  return total;
};

export { ex1, ex2 };
