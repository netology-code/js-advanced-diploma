import {
  Bowman, Swordsman, Magician, Vampire, Undead, Daemon,
} from './Characters/Characters';

class CharacterFactory {
  constructor(charObject) {
    this.level = charObject.level;
    this.attack = charObject.attack;
    this.defence = charObject.defence;
    this.health = charObject.health;
    this.type = charObject.type;
    this.attackRange = charObject.attackRange;
    this.moveRange = charObject.moveRange;
  }
}
