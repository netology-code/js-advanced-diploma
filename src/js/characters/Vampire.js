import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 40;
    this.defence = 25;
    this.charHikeRange = 2;
    this.charAttackRange = 2;
  }
}
