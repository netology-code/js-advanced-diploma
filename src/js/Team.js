/**
 * Класс, представляющий персонажей команды
 *
 * @example
 *
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
// import { randomFromRange } from './utils';

export default class Team {
  // constructor(characters) {
  //   this.characters = [...characters];
  // }
  constructor(allowedTypes, maxLevel, characterCount, generatorFunc) {
    this.characters = [];
    this.allowedTypes = allowedTypes;
    this.generatorFunc = generatorFunc;
    const playerGenerator = this.generatorFunc(this.allowedTypes, maxLevel);

    for (let i = 0; i < characterCount; i++) {
      this.characters.push(playerGenerator.next().value);
    }
    console.log('generate Team', this.characters);
  }

  get count() {
    return this.characters.length;
  }

  addRandomChar(maxLevel, characterCount = 1) {
    const playerGenerator = this.generatorFunc(this.allowedTypes, maxLevel);

    for (let i = 0; i < characterCount; i++) {
      this.characters.push(playerGenerator.next().value);
    }
    console.log('add to Team', this.characters);
  }

  remove(character) {
    const index = this.characters.indexOf(character);

    if (index === -1) {
      return null;
    }
    return this.characters.splice(index, 1);
  }

  isOwnCharacter(character) {
    return this.characters.includes(character);
  }

  isEmpty() {
    return !this.characters.length;
  }
}
