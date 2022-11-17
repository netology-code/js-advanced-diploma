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
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export default class Team {
  static getStartPlayerTeam() {
    return [new Bowman(1), new Swordsman(1)];
  }

  static getPlayerTeam() {
    return [Bowman, Swordsman, Magician];
  }

  static getComputerTeam() {
    return [Daemon, Undead, Vampire];
  }
  // TODO: write your logic here
}
