import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 20;
    this.defence = 40;
    this.charHikeRange = 1;
    this.charAttackRange = 4;
  }
}
