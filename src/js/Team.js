const randomId = require('random-id');

/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * @property characters - массив персонажей
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
  // TODO: write your logic here
  constructor(characters) {
    this._characters = new Map();
    if (characters) {
      characters.forEach(character => {
        this._characters.set(randomId(5), character);
      });
    }
  }

  get characters() {
    return [...this._characters.values()];
  }

  set characters(arr) {
    this._characters.clear();
    [...arr].forEach(character => {
      this._characters.set(randomId(5), character)
    })
  }

  add(...character) {
    character.forEach(character => {
      this._characters.set(randomId(5), character)
    })
  }
}
