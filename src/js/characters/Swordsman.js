import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.attack = 40;
    this.deffence = 10;
    this.type = 'swordsman';
    this.level = level;
    this.distance = 4;
    this.distanceAttack = 1;
  }
}
