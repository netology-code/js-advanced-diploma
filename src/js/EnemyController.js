/* eslint-disable no-use-before-define */
export default function doTurn(compPlayerTeam) {
  const rangedChars = rangeCharsByAttack(compPlayerTeam);
  console.log(compPlayerTeam, rangedChars);
}

function rangeCharsByAttack(compPlayerTeam) {
  const rangedChars = [...compPlayerTeam];

  rangedChars.sort((char1, char2) => char2.attackRange - char1.attackRange);
  return rangedChars;
}
