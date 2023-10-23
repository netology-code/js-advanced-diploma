import Character from '../Character.js';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 60;
    this.defence = 10;
  }
}