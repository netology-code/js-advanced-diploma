import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level);
    this.type = 'bowman';
    this.attack = 25;
    this.defence = 25;
  }
}
