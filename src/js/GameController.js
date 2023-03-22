import { generateTeam, randomFromRange } from './generators';
import GamePlay from './GamePlay';
import GameState from './GameState';
import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import {
  Bowman, Swordsman, Magician, Vampire, Undead, Daemon,
} from './Characters/Characters';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.userPlayerTypes = [Bowman, Swordsman, Magician];
    this.compPlayerTypes = [Vampire, Undead, Daemon];
  }

  init() {
    this.gameState = new GameState();
    this.gamePlay.drawUi(themes.prairie);

    // TODO: add event listeners to gamePlay events
    this.registerEventListeners();

    // TODO: load saved stated from stateService

    this.positionedCharacters = [];

    // create team for player & computer
    this.userPlayerTeam = generateTeam(this.userPlayerTypes, 1, this.gamePlay.initialCountOfChars);
    this.compPlayerTeam = generateTeam(this.compPlayerTypes, 1, this.gamePlay.initialCountOfChars);

    // place characters on board
    this.placeUserTeamOnBoard();
    this.placeCompTeamOnBoard();

    // reDrawPositions
    this.gamePlay.redrawPositions(this.positionedCharacters);

    // console.log(this.positionedCharacters[0].character);
  }

  registerEventListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  placeUserTeamOnBoard() {
    const positions = this.getInitialPositions('user');

    this.userPlayerTeam.characters.forEach((character, index) => {
      this.positionedCharacters.push(new PositionedCharacter(character, positions[index]));
    });
  }

  placeCompTeamOnBoard() {
    const positions = this.getInitialPositions('comp');

    this.compPlayerTeam.characters.forEach((character, index) => {
      this.positionedCharacters.push(new PositionedCharacter(character, positions[index]));
    });
  }

  getInitialPositions(playerType) {
    const positions = [];
    let counter = 0;
    while (counter < this.gamePlay.initialCountOfChars) {
      const position = playerType === 'user' ? this.getRandomUserCharPosition() : this.getRandomCompCharPosition();

      if (!positions.includes(position)) {
        positions.push(position);
        counter += 1;
      }
    }
    return positions;
  }

  getRandomUserCharPosition() {
    return this.getRandomCellInTwoColumns(0);
  }

  getRandomCompCharPosition() {
    return this.getRandomCellInTwoColumns(this.gamePlay.boardSize - 2);
  }

  getRandomCellInTwoColumns(shift) {
    const { boardSize } = this.gamePlay;
    const index = randomFromRange(0, boardSize * 2 - 1);

    if (index < boardSize) {
      return index * boardSize + shift;
    }
    return (index - boardSize) * boardSize + 1 + shift;
  }

  onCellClick(index) {
    const character = this.getCharInPosition(index);
    if (!character) {
      return;
    }
    if (!this.isUserPlayer(character)) {
      GamePlay.showError('Это не ваш персонаж!');
      return;
    }
    if (this.gameState.selectedIndex) {
      this.gamePlay.deselectCell(this.gameState.selectedIndex);
    }
    this.gameState.selectedIndex = index;
    this.gamePlay.selectCell(index);
  }

  onCellEnter(index) {
    const character = this.getCharInPosition(index);
    if (character) {
      const {
        level, attack, defence, health,
      } = character;
      const tooltip = `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;

      this.gamePlay.showCellTooltip(tooltip, index);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  getCharInPosition(index) {
    const positionedChar = this.positionedCharacters.find(o => o.position === index);

    return positionedChar === undefined ? null : positionedChar.character;
  }

  isUserPlayer(character) {
    return this.userPlayerTypes.reduce((result, item) => result || (character instanceof item), false);
  }
}
