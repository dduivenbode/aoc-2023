import { getInput } from "../../util/file.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class day3 {
  input: string[];
  title: string = "--- Day 3: Gear Ratios ---";
  #symbols: string[] = [];
  constructor() {
    // this.input = getInput(__dirname, "input_sample.txt");
    this.input = getInput(__dirname, "input.txt");
    this.#prep_data();
  }

  #prep_data(): void {
    const s: Set<string> = new Set();
    for (const line of this.input) {
      for (const char of line) {
        if (isNaN(parseInt(char)) && char !== ".") {
          s.add(char);
        }
      }
    }
    this.#symbols = Array.from(s);
  }

  #getNumber(pos: number, line: string): [number, number] {
    let num: string = line[pos],
      i: number = pos + 1;
    for (i; i < line.length; i++) {
      if (!isNaN(parseInt(line[i]))) {
        num = num + line[i];
      } else {
        break;
      }
    }
    return [parseInt(num), i];
  }

  #hasAdjacentSymbol(line: string, y: number, x1: number, x2: number): boolean {
    //collect strings
    const to_check: string[] = [];
    const from = x1 > 0 ? x1 - 1 : x1;
    const to = x2 < line.length - 1 ? x2 + 1 : x2;
    if (y > 0) {
      to_check.push(this.input[y - 1].slice(from, to));
    }
    if (y < this.input.length - 1) {
      to_check.push(this.input[y + 1].slice(from, to));
    }
    if (x1 > 0) {
      to_check.push(this.input[y][from]);
    }
    if (x2 < line.length - 1) {
      to_check.push(this.input[y][to - 1]);
    }

    const filterString = (symbol: string) => to_check.some(str => str.includes(symbol));
    return this.#symbols.filter(filterString).length > 0;
  }

  ex1(): number {
    const part_numbers: number[] = [];
    for (const [i, line] of this.input.entries()) {
      let n = 0;
      while (n <= line.length) {
        if (!isNaN(parseInt(line[n]))) {
          let [number, pos] = this.#getNumber(n, line);
          if (this.#hasAdjacentSymbol(line, i, n, pos)) {
            part_numbers.push(number);
          }
          n = pos;
        } else {
          n++;
        }
      }
    }

    return part_numbers.reduce((t, v) => (t += v), 0);
  }

  #getNumberFromString(str: string): number {
    return parseInt(str.replace(/\D/g, ""));
  }

  #containsNumber(str: string): boolean {
    return /\d/.test(str);
  }

  #getPartFromPos(line: string, pos: number): number {
    let x1: number = pos,
      x2: number = pos;
    for (x1; x1 > -1; x1--) {
      if (!this.#containsNumber(line[x1])) {
        break;
      }
    }
    for (x2; x2 < line.length; x2++) {
      if (!this.#containsNumber(line[x2])) {
        break;
      }
    }
    return this.#getNumberFromString(line.slice(x1 + 1, x2));
  }

  #getPartsFromString(line: string, x1: number, x2: number): number[] {
    const parts: number[] = [];

    let s = line.slice(x1, x2);
    if (s.length === 3) {
      if (!this.#containsNumber(s[1])) {
        if (this.#containsNumber(s[0])) {
          parts.push(this.#getPartFromPos(line, x1));
        }
        if (this.#containsNumber(s[2])) {
          parts.push(this.#getPartFromPos(line, x2 - 1));
        }
      } else {
        if (this.#containsNumber(s)) {
          parts.push(this.#getPartFromPos(line, x1 + 1));
        }
      }
    } else {
      if (this.#containsNumber(s)) {
        parts.push(this.#getPartFromPos(line, x1));
      }
    }

    return parts;
  }

  #isGear(x: number, y: number): [boolean, number] {
    const part_numbers: number[] = [];
    const from = x > 0 ? x - 1 : x;
    const to = x < this.input[0].length - 1 ? x + 1 : x;

    if (y > 0) {
      part_numbers.push(...this.#getPartsFromString(this.input[y - 1], from, to + 1));
    }
    if (y < this.input.length - 1) {
      part_numbers.push(...this.#getPartsFromString(this.input[y + 1], from, to + 1));
    }
    if (x > 0) {
      part_numbers.push(...this.#getPartsFromString(this.input[y], from, from + 1));
    }
    if (x < this.input[0].length - 1) {
      part_numbers.push(...this.#getPartsFromString(this.input[y], to, to + 1));
    }
    if (part_numbers.length === 2) {
      return [true, part_numbers[0] * part_numbers[1]];
    } else {
      return [false, 0];
    }
  }

  ex2(): number {
    const gear_ratios: number[] = [];
    for (const [y, line] of this.input.entries()) {
      for (let x = 0; x < line.length; x++) {
        if (line[x] === "*") {
          let [isGear, ratio] = this.#isGear(x, y);
          if (isGear) {
            gear_ratios.push(ratio);
          }
        }
      }
    }

    return gear_ratios.reduce((t, v) => (t += v), 0);
  }
}
