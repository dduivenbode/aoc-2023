import { getInput } from "../../util/file.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class day2 {
  input: string[];
  games: { [key: string]: { [key: string]: number[] } } = {};
  constructor() {
    // this.input = getInput(__dirname, "input_sample.txt");
    this.input = getInput(__dirname, "input.txt");
    this.#prep_data();
  }

  #prep_data(): void {
    for (const line of this.input) {
      const game = line.split(":")[0].split(" ")[1];
      const sets = line.split(":")[1].split(";");
      this.games[game] = {};
      for (let i = 0; i < sets.length; i++) {
        const cube = sets[i].split(",");
        for (let n = 0; n < cube.length; n++) {
          const [amount, color] = cube[n].trim().split(" ");
          if (!this.games[game][color.trim()]) {
            this.games[game][color.trim()] = [];
          }
          this.games[game][color.trim()].push(parseInt(amount.trim()));
        }
      }
    }
  }

  ex1(): number {
    const limits: { [key: string]: number } = {
      red: 12,
      green: 13,
      blue: 14
    };

    const possible_games: number[] = [];

    for (let game in this.games) {
      let possible = true;
      for (let color in limits) {
        if (!this.games[game][color] || this.games[game][color].some(amount => amount > limits[color])) {
          possible = false;
          break;
        }
      }
      if (possible) {
        possible_games.push(parseInt(game));
      }
    }

    return possible_games.reduce((total, value) => (total += value), 0);
  }

  ex2(): number {
    const values: number[] = [];

    for (const game in this.games) {
      let game_power = 1;
      for (const prop in this.games[game]) {
        game_power = game_power * Math.max(...this.games[game][prop]);
      }
      values.push(game_power);
    }

    return values.reduce((total, value) => (total += value), 0);
  }
}
