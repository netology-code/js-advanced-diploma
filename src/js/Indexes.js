export default class Indexes {
  constructor(boardSize) {
    this.boardSize = boardSize;
    const arrayIndexes = [];
    for (let i = 0; i < this.boardSize; i += 1) {
      arrayIndexes[i] = [];
      for (let j = 0; j < this.boardSize; j += 1) {
        arrayIndexes[i][j] = j + i * this.boardSize;
      }
    }
    this.arrayIndexes = arrayIndexes;
  }
  getIndexes(index) {
    for (let i = 0; i < this.boardSize; i += 1) {
      for (let j = 0; j < this.boardSize; j += 1) {
        if (this.arrayIndexes[i][j] === index) {
          return [i, j];
        }
      }
    }
  }
}