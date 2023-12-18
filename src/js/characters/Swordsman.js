import Character from '../Character'

export default class Swordsman extends Character {
    constructor(level) {
        super(level);
        this.level = level;
        this.attack = 40;
        this.defence = 40;
        this.health = 100;
        this.type = 'swordsman';
    }
}