import chalk from "chalk";
import { ex1, ex2 } from "./exercises/day_1/main.js";
import day2 from "./exercises/day_2/main.js";
import day3 from "./exercises/day_3/main.js";
import { exec as day4 } from "./exercises/day_4/main.js";
import { day5 } from "./exercises/day_5/main.js";
import { day6 } from "./exercises/day_6/main.js";
import { day7 } from "./exercises/day_7/main.js";
import { day8 } from "./exercises/day_8/main.js";
import { day9 } from "./exercises/day_9/main.js";
import { day10 } from "./exercises/day_10/main.js";
import { day11 } from "./exercises/day_11/main.js";
import { day12 } from "./exercises/day_12/main.js";
import { day13 } from "./exercises/day_13/main.js";
import { day14 } from "./exercises/day_14/main.js";
import { day15 } from "./exercises/day_15/main.js";

let start: number = 0,
  end: number = 0;

start = Date.now();

// console.log(chalk.green("Day 1: Trebuchet?!"));
// console.log(chalk.blue(`1: ${ex1()}`));
// console.log(chalk.blue(`2: ${ex2()}`));

// console.log(chalk.green("\nDay 2: Cube Conundrum"));
// const day_2 = new day2();
// console.log(chalk.blue(`1: ${day_2.ex1()}`));
// console.log(chalk.blue(`2: ${day_2.ex2()}`));

// const day_3 = new day3();
// console.log(chalk.green(`\n${day_3.title}`));
// console.log(chalk.blue(`1: ${day_3.ex1()}`));
// console.log(chalk.blue(`2: ${day_3.ex2()}`));

// console.log(chalk.green("\nDay 4: Scratchcards\n"));
// day4();

// this one takes too long (~1 minute)
// console.log(chalk.green("\nDay 5: If You Give A Seed A Fertilizer"));
// day5();

// console.log(chalk.green("\nDay 6: Wait For It"));
// day6();

// console.log(chalk.green("\nDay 7: Camel Cards"));
// day7();

// console.log(chalk.green("\nDay 8: Haunted Wasteland"));
// day8();

// console.log(chalk.green("\nDay 9: Mirage Maintenance"));
// day9();

// console.log(chalk.green("\nDay 10: Pipe Maze"));
// day10();

// console.log(chalk.green("\nDay 11: Cosmic Expansion"));
// day11();

// console.log(chalk.green("\nDay 12: Hot Springs"));
// day12();

// console.log(chalk.green("\nDay 13: Point of Incidence"));
// day13();

// console.log(chalk.green("\nDay 14: Parabolic Reflector Dish"));
// day14();

console.log(chalk.green("\nDay 15: Lens Library"));
day15();

end = Date.now();
console.log(chalk.yellow(`\nIt took ${end - start} ms`));
