import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 60;
    this.defence = 10;
    this.charHikeRange = 4;
    this.charAttackRange = 1;
  }
}
