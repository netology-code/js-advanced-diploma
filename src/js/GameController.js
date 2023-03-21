import { generateTeam, randomFromRange } from './generators';
import themes from './themes';
import {
  Bowman, Swordsman, Magician, Vampire, Undead, Daemon,
} from './Characters/Characters';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.userPlayerTypes = [Bowman, Swordsman, Magician];
    this.compPlayerTypes = [Vampire, Undead, Daemon];
    this.countOfChars = 2; // Уточнить !!!
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.gamePlay.drawUi(themes.prairie);
    // create team for player
    this.userPlayerTeam = generateTeam(this.userPlayerTypes, 1, this.countOfChars);
    // create team for computer
    this.compPlayerTeam = generateTeam(this.compPlayerTypes, 1, this.countOfChars);
    // place characters on board
    this.placeUserTeamOnBoard();
    this.placeCompTeamOnBoard();
    // binding characters to cell

    // reDrawPositions
  }

  placeUserTeamOnBoard() {
    const positions = [];
    let counter = 0;
    while (counter < this.countOfChars) {
      const position = this.getRandomUserCharPosition();

      if (!positions.includes(position)) {
        positions.push(position);
        counter += 1;
      }
    }
    console.log(positions);
  }

  placeCompTeamOnBoard() {
    const positions = [];
    let counter = 0;
    while (counter < this.countOfChars) {
      const position = this.getRandomCompCharPosition();

      if (!positions.includes(position)) {
        positions.push(position);
        counter += 1;
      }
    }
    console.log(positions);
  }

  getRandomUserCharPosition() {
    return this.getRandomCellInTwoColumns(this.gamePlay.boardSize, 0);
  }

  getRandomCompCharPosition() {
    return this.getRandomCellInTwoColumns(this.gamePlay.boardSize, 6);
  }

  getRandomCellInTwoColumns(boardSize, shift) {
    const index = randomFromRange(0, boardSize * 2 - 1);

    if (index < boardSize) {
      return index * boardSize + shift;
    }
    return (index - boardSize) * boardSize + 1 + shift;
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
