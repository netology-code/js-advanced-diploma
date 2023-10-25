import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 20;
    this.defence = 40;
  }
}
