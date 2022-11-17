import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.attack = 25;
    this.deffence = 25;
    this.type = 'vampire';
    this.level = level;
    this.distance = 2;
    this.distanceAttack = 2;
  }
}
