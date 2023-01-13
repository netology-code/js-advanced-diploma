export default function selectCharacter(pCharacter) {
  let { character, position } = pCharacter;
  const y = Math.floor(position / this.gamePlay.boardSize);
  const x = position % this.gamePlay.boardSize;

  const posibleAttacks = [];
  const posibleMoves = [];

  const start = (i, attibute) => {
    return i - attibute >= 0 ? i - attibute : 0;
  };
  const end = (i, attibute) => {
    return i + attibute < this.gamePlay.boardSize
      ? i + attibute
      : this.gamePlay.boardSize - 1;
  };

  for (
    let i = start(y, character.attackRange);
    i <= end(y, character.attackRange);
    i += 1
  ) {
    for (
      let n = start(x, character.attackRange);
      n <= end(x, character.attackRange);
      n += 1
    ) {
      const cell = i * this.gamePlay.boardSize + n;
      if (this.getCharacter(cell) && cell !== position) {
        if (!this.isSameTeam(character, this.getCharacter(cell).character)) {
          posibleAttacks.push(cell);
        }
      }
    }
  }

  for (
    let yMove = start(y, character.moveRange);
    yMove <= end(y, character.moveRange);
    yMove += 1
  ) {
    for (
      let xMove = start(x, character.moveRange);
      xMove <= end(x, character.moveRange);
      xMove += 1
    ) {
      const cell = yMove * this.gamePlay.boardSize + xMove;
      if (cell !== position) {
        if (y - x === yMove - xMove) {
          posibleMoves.push(cell);
        } else if (y + x === yMove + xMove) {
          posibleMoves.push(cell);
        } else if (xMove === x) {
          posibleMoves.push(cell);
        } else if (yMove === y) {
          posibleMoves.push(cell);
        }
      }
    }
  }

  return {
    character,
    position,
    positionXY: { x, y },
    posibleMoves,
    posibleAttacks,
  };
}
