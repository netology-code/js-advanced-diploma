import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 60;
    this.defence = 10;
    this.charHikeRange = 4;
    this.charAttackRange = 1;
  }
}
