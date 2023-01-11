const randomId = require('random-id');

class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('new Character() is forbidden');
    }
  }
}

class Bowman extends Character {
  constructor(level) {
    super(level);
    this.type = 'bowman';
    this.attack = 25;
    this.defence = 25;
  }
}

class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.type = 'swordsman';
    this.attack = 40;
    this.defence = 10;
  }
}

class Magician extends Character {
  constructor(level) {
    super(level);
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
  }
}

function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const level = Math.ceil(Math.random() * maxLevel);
    yield new type(level);
  }
}

const playerTypes = [Bowman, Swordsman, Magician];

function generateTeam(allowedTypes, maxLevel, characterCount) {
  let count = 0;
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  const team = new Team();
  while (count++ < characterCount) {
    team.add(playerGenerator.next().value);
  }
  return team;
}

class Team {
  // TODO: write your logic here
  constructor(characters) {
    this._characters = new Map();
    if (characters) {
      characters.forEach((character) => {
        this._characters.set(randomId(5), character);
      });
    }
  }

  get characters() {
    return [...this._characters.values()];
  }

  set characters(arr) {
    this._characters.clear();
    [...arr].forEach((character) => {
      this._characters.set(randomId(5), character);
    });
  }

  add(...character) {
    character.forEach((character) => {
      this._characters.set(randomId(5), character);
    });
  }
}

const team = generateTeam(playerTypes, 3, 4); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3

console.log(
  team.characters[0].level, // 3
  team.characters[1].level, // 3
  team.characters[2].level, // 1
);
