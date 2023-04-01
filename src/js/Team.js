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

export default class Team {
  constructor(allowedTypes, generatorFunc, characters = []) {
    this.allowedTypes = allowedTypes;
    this.generatorFunc = generatorFunc;
    this.characters = characters.filter(char => this.allowedTypes.find(
      allowedType => allowedType.name.toLowerCase() === char.type,
    ));
  }

  get count() {
    return this.characters.length;
  }

  addRandomChar(maxLevel, characterCount = 1) {
    const playerGenerator = this.generatorFunc(this.allowedTypes, maxLevel);

    for (let i = 0; i < characterCount; i++) {
      this.characters.push(playerGenerator.next().value);
    }
  }

  remove(character) {
    const index = this.characters.indexOf(character);

    if (index === -1) {
      return null;
    }
    return this.characters.splice(index, 1);
  }

  clear() {
    this.characters = [];
  }

  isOwnCharacter(character) {
    return this.characters.includes(character);
  }

  isEmpty() {
    return !this.characters.length;
  }
}
