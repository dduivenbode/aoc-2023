import { readFileSync } from "fs";
import { join } from "path";

export const getInput = (dirname: string, filename: string): string[] => {
  return readFileSync(join(dirname, filename), "utf-8").split(/\r?\n/);
};

export const getInputPlain = (dirname: string, filename: string): string => {
  return readFileSync(join(dirname, filename), "utf-8");
};
