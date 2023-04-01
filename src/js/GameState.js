import {
  Bowman, Swordsman, Magician, Vampire, Undead, Daemon,
} from './Characters/Characters';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
  constructor() {
    this.currentLevel = 1;
    this.positionedCharacters = [];
    this.selected = {
      index: null,
      character: null,
    };

    this.score = 0;
  }

  static from(object) {
    const state = {};

    for (const prop in object) {
      if (Object.hasOwn(object, prop)) {
        state[prop] = object[prop];
      }
    }
    return state;
  }

  static createCharacterFromObject(obj) {
    const charClasses = [
      Bowman,
      Swordsman,
      Magician,
      Vampire,
      Undead,
      Daemon,
    ];
    const CharClassName = charClasses.find(item => item.name.toLowerCase() === obj.type);
    const charClass = new CharClassName();

    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        charClass[prop] = obj[prop];
      }
    }
    return charClass;
  }

  setState(state) {
    this.currentLevel = state.currentLevel;
    this.score = state.score;
    this.positionedCharacters = [];
    state.positionedCharacters.forEach(item => {
      const char = GameState.createCharacterFromObject(item.character);
      this.positionedCharacters.push(new PositionedCharacter(char, item.position));
    });
  }
}
