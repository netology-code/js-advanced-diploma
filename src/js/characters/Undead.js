import Character from '../Character'

export default class Undead extends Character {
    constructor(level) {
        super(level);
        this.level = level;
        this.attack = 40;
        this.defence = 10;
        this.health = 100;
        this.type = 'undead';
    }
}