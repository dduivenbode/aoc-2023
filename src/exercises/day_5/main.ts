import { getInputPlain } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const day5 = (): void => {
  // let input = getInputPlain(__dirname, "input_sample.txt");
  let input = getInputPlain(__dirname, "input.txt");
  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

type Entry = {
  name: string;
  map: Array<number[]>;
};

const createAlmanac = (input: string[]): Entry[] => {
  const almanac: Array<Entry> = [];
  for (const line of input) {
    const x = line.split("\n");
    almanac.push(
      x.reduce((acc, curr, i) => {
        if (i == 0) {
          acc.name = curr;
          acc.map = [];
        } else {
          acc.map.push(
            curr
              .split(" ")
              .filter(n => n)
              .map(n => parseInt(n))
          );
        }
        return acc;
      }, {} as Entry)
    );
  }
  return almanac;
};

const createData = (input: string): [number[], Entry[]] => {
  const si = input.split("\n\n");
  const seeds = si
    .shift()
    ?.split(":")[1]
    .trim()
    .split(" ")
    .filter(n => n)
    .map(n => parseInt(n));

  return [seeds!, createAlmanac(si)];
};

const getLocations = (seeds: number[], almanac: Entry[]): number[] => {
  //recursion might be funny here, but reduce quicker
  const locations: Array<number> = [];
  for (const seed of seeds) {
    locations.push(
      almanac.reduce((acc: number, curr) => {
        //find matching map entry for this input
        const line = curr.map.filter(m => acc >= m[1] && acc < m[1] + m[2]);
        if (line.length > 0) {
          const [dest, source] = line[0];
          return dest + (acc - source);
        } else {
          return acc;
        }
      }, seed)
    );
  }
  return locations;
};

const getSeed = (location: number, almanac: Entry[]): number => {
  return almanac.reduce((acc: number, curr) => {
    //find matching map entry for this input
    const line = curr.map.filter(m => acc >= m[0] && acc < m[0] + m[2]);
    if (line.length > 0) {
      const [dest, source] = line[0];
      return source + (acc - dest);
    } else {
      return acc;
    }
  }, location);
};

const ex1 = (input: string): number => {
  const [seeds, almanac] = createData(input);
  return Math.min(...getLocations(seeds, almanac));
};

type Range = {
  from: number;
  to: number;
  add: number;
};

const createLocationRanges = (loc: Entry): Range[] => {
  let r: Range[] = [];

  loc.map.sort((a, b) => a[1] - b[1]);
  if (loc.map[0][1] > 0) {
    r.push({ from: 0, to: loc.map[0][1] - 1, add: 0 });
  }
  for (const m of loc.map) {
    r.push({ from: m[1], to: m[1] + m[2] - 1, add: m[0] - m[1] });
  }

  return r;
};

const createSeedRanges = (seeds: number[]): Range[] => {
  let r: Range[] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    r.push({ from: seeds[i], to: seeds[i] + seeds[i + 1] - 1, add: 0 });
  }
  return r;
};

const ex2 = (input: string): number | undefined => {
  const [seeds, almanac] = createData(input);
  const loc = almanac[almanac.length - 1];
  const rs = createLocationRanges(loc);

  const rev_almanac = almanac.reverse();
  rev_almanac.shift();

  const seed_range = createSeedRanges(seeds);

  for (const r of rs) {
    for (let i = r.from; i <= r.to; i++) {
      const s = getSeed(i, rev_almanac);
      if (seed_range.filter(r => s >= r.from && s <= r.to).length > 0) {
        // this is lowest location
        return i + r.add;
      }
    }
  }
};
