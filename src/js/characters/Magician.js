import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.attack = 10;
    this.deffence = 40;
    this.type = 'magician';
    this.level = level;
    this.distance = 1;
    this.distanceAttack = 4;
  }
}
