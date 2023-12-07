import { getInput } from "../../util/file.js";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const day7 = (): void => {
  // let input = getInput(__dirname, "input_sample.txt");
  let input = getInput(__dirname, "input.txt");
  console.log(chalk.blue(`1: ${ex1(input)}`));
  console.log(chalk.blue(`2: ${ex2(input)}`));
};

type Hand = {
  cards: number[];
  bid: number;
  value?: number;
};

const cardMap = {
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
};

// dont't need this, but seemed like a nice opportunity to use enums
enum HandValue {
  High_Card = 1,
  One_Pair,
  Two_Pair,
  Three_of_a_Kind,
  Full_House,
  Four_of_a_Kind,
  Five_of_a_Kind
}

const getData = (input: string[], cardMap: {}): Hand[] => {
  return input.map(line => {
    const [cards, bid] = line.split(" ");
    return {
      cards: cards.split("").map(c => cardMap[c] || parseInt(c)),
      bid: parseInt(bid.trim())
    };
  });
};

const countCardsAndSort = (h: Hand): Array<[string, number]> => {
  const counter: Record<string, number> = h.cards.reduce((count, value) => {
    count[value] = count[value] ? count[value] + 1 : 1;
    return count;
  }, {});

  return Object.entries(counter).sort((a, b) => b[1] - a[1]);
};

const assignHandValue = (includeJokers: boolean = false): ((h: Hand) => Hand) => {
  // return mapper function
  return (h: Hand) => {
    const jokers = includeJokers ? h.cards.filter(c => c === 1).length : 0;
    let sorted = countCardsAndSort(h);
    // remove jokers from remaining count
    sorted = sorted.filter(c => c[0] !== "1");

    if (jokers === 4 || jokers === 5) {
      // 4 or 5 jokers
      h.value = HandValue.Five_of_a_Kind;
    } else {
      if (sorted[0][1] + jokers === 5) {
        h.value = HandValue.Five_of_a_Kind;
      } else if (sorted[0][1] + jokers === 4) {
        h.value = HandValue.Four_of_a_Kind;
      } else if ((sorted[0][1] === 3 && sorted[1][1] === 2) || (jokers === 1 && sorted[0][1] === 2 && sorted[1][1] === 2)) {
        h.value = HandValue.Full_House;
      } else if (sorted[0][1] + jokers === 3) {
        h.value = HandValue.Three_of_a_Kind;
      } else if (sorted[0][1] === 2 && sorted[1][1] === 2) {
        h.value = HandValue.Two_Pair;
      } else if (sorted[0][1] + jokers === 2) {
        h.value = HandValue.One_Pair;
      } else {
        h.value = HandValue.High_Card;
      }
    }
    return h;
  };
};

const sortHandsAsc = (a: Hand, b: Hand): number => {
  if (b.value == a.value) {
    for (const i in a.cards) {
      if (a.cards[i] !== b.cards[i]) {
        return a.cards[i] - b.cards[i];
      }
    }
  } else {
    return a.value! - b.value!;
  }
  return 0;
};

const calculateWinnings = (acc: number, hand: Hand, i: number): number => {
  return acc + hand.bid * (i + 1);
};

const ex1 = (input: string[]): number => {
  return getData(input, cardMap).map(assignHandValue()).sort(sortHandsAsc).reduce(calculateWinnings, 0);
};

const ex2 = (input: string[]): number => {
  // 'J' is now a joker and has the lowest value
  cardMap["J"] = 1;
  return getData(input, cardMap).map(assignHandValue(true)).sort(sortHandsAsc).reduce(calculateWinnings, 0);
};
