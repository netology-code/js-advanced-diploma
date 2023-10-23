import PositionedCharacter from './PositionedCharacter.js';
import Character from './Character.js';

export default class EnemyTeam {
  constructor(positionedCharacterArray) {
    for (let i = 0; i < positionedCharacterArray.length; i += 1) {
      const character = positionedCharacterArray[i].character;
      if (character.hasOwnProperty('id')) {
        Object.setPrototypeOf(character, Character.prototype);
      } else {
        character.id = i + 11;
      }
      this[`teamMember${character.id}`] = {
        character: character,
        position: positionedCharacterArray[i].position,
      }
    }
  }

  getPositionedCharacters() {
    const arrayPositionedCharacters = [];
    for (let key in this) {
      arrayPositionedCharacters.push(new PositionedCharacter(this[key].character, this[key].position));
    }
    return arrayPositionedCharacters;
  }

  setDamage(charId, attack) {
    const damage = Math.trunc(Math.max(attack - this[`teamMember${charId}`].character.defence, attack * 0.1));
    this[`teamMember${charId}`].character.health -= damage;
    if (this[`teamMember${charId}`].character.health <= 0) {
      delete this[`teamMember${charId}`];
    }
  }

  setNewPosition(charId, newPosition) {
    for (let key in this) {
      if (+this[key].character.id === +charId) {
        this[key].position = newPosition;
      }
    }
  }

  getAtteckerId() {
    const daemons = this.getPositionedCharacters().filter(el => el.character.type === 'daemon');
    const vampires = this.getPositionedCharacters().filter(el => el.character.type === 'vampire');
    const undeads = this.getPositionedCharacters().filter(el => el.character.type === 'undead');
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
}