import PositionedCharacter from './PositionedCharacter';
import Character from './Character';
import { generateTeam } from './generators';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export default class EnemyTeam {
  constructor(positionedCharacterArray) {
    for (let i = 0; i < positionedCharacterArray.length; i += 1) {
      const { character } = positionedCharacterArray[i];
      if (Object.prototype.hasOwnProperty.call(character, 'id')) {
        Object.setPrototypeOf(character, Character.prototype);
      } else {
        character.id = i + 11;
      }
      this[`teamMember${character.id}`] = {
        character,
        position: positionedCharacterArray[i].position,
      };
    }
  }

  getPositionedCharacters() {
    const arrayPositionedCharacters = [];
    Object.values(this).forEach((value) => {
      arrayPositionedCharacters.push(new PositionedCharacter(value.character, value.position));
    });
    return arrayPositionedCharacters;
  }

  setDamage(charId, attack, callback) {
    const damage = Math.trunc(Math.max(attack - this[`teamMember${charId}`].character.defence, attack * 0.1));
    this[`teamMember${charId}`].character.health -= damage;
    if (this[`teamMember${charId}`].character.health <= 0) {
      callback(this[`teamMember${charId}`].character.defence);
      delete this[`teamMember${charId}`];
    }
  }

  setNewPosition(charId, newPosition) {
    Object.keys(this).forEach((key) => {
      if (+this[key].character.id === +charId) {
        this[key].position = newPosition;
      }
    });
  }

  getAtteckerId() {
    const daemons = this.getPositionedCharacters().filter((el) => el.character.type === 'daemon');
    const vampires = this.getPositionedCharacters().filter((el) => el.character.type === 'vampire');
    const undeads = this.getPositionedCharacters().filter((el) => el.character.type === 'undead');
    let characters;
    if (daemons.length === 0 && vampires.length === 0) {
      characters = undeads;
    } else if (daemons.length === 0 && vampires.length !== 0) {
      characters = vampires;
    } else {
      characters = daemons;
    }
    const attackerId = characters.reduce((acc, item) => {
      if (item.character.attack > acc[0]) {
        return [item.character.attack, item.character.id];
      }
      return acc;
    }, [0, {}])[1];
    return attackerId;
  }

  static teamLevelUp(round, countCharacterInTeam) {
    let team;
    if (round < 3) {
      team = generateTeam([Daemon, Undead, Vampire], 2, countCharacterInTeam);
    } else {
      team = generateTeam([Daemon, Undead, Vampire], 1, countCharacterInTeam);
    }
    const arrayCharacters = team.characters.map((el) => {
      const element = el;
      let coeff = 1;
      if (round === 3) {
        coeff = 1.5;
        element.health = 100;
      }
      if (round === 4) {
        coeff = 2;
        element.health = 100;
      }
      element.attack *= coeff;
      element.defence *= coeff;
      element.level = round;
      return element;
    });
    return { characters: arrayCharacters };
  }

  hasIndex(index) {
    return Object.values(this).some((value) => index === value.position);
  }
}
