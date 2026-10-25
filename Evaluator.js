const WILD_ID = 5;
export function calculateWin(middleRow, bet) {
  let targetId = middleRow[0].id;
  let matchCount = 1;

  for (let i = 1; i < 5; i++) {
    let currentId = middleRow[i].id;

    if (currentId === targetId || currentId === WILD_ID || targetId === WILD_ID) {
      matchCount++;

    } else {
      break;
    }
  }
  if (matchCount >= 3) {

    let multiplier = 0;
    if (matchCount === 3) multiplier = 5;
    if (matchCount === 4) multiplier = 20;
    if (matchCount === 5) multiplier = 100;

    return {
      isWin: true,
      matchCount: matchCount,
      winAmount: bet * multiplier
    };
  }
  return { isWin: false, matchCount: 0, winAmount: 0 };
}