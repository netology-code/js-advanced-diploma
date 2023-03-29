/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor(characters) {
    this.characters = [...characters];
  }

  get count() {
    return this.characters.length;
  }

  remove(character) {
    const index = this.characters.indexOf(character);

    if (index === -1) {
      return null;
    }
    this.characters.splice(index, 1);
    console.log('remove: ', character, 'rest: ', this.characters);
  }

  isEmpty() {
    return !this.characters.length;
  }
}
