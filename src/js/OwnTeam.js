import PositionedCharacter from './PositionedCharacter.js';
import Character from './Character.js';

export default class OwnTeam {
  constructor(positionedCharacterArray) {
    for (let i = 0; i < positionedCharacterArray.length; i += 1) {
      const character = positionedCharacterArray[i].character;
      if (character.hasOwnProperty('id')) {
        Object.setPrototypeOf(character, Character.prototype);
      } else {
        character.id = i + 1;
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

  setNewPosition(charId, newPosition) {
    for (let key in this) {
      if (+this[key].character.id === +charId) {
        this[key].position = newPosition;
      }
    }
  }

  getTarget() {
    return this.getPositionedCharacters().reduce((acc, item) => {
      if (item.character.defence < acc[0]) {
        return [item.character.health, item.character.id];
      }
      return acc;
    }, [500, {}])[1];
  }

  setDamage(charId, attack) {
    const damage = Math.trunc(Math.max(attack - this[`teamMember${charId}`].character.defence, attack * 0.1));
    this[`teamMember${charId}`].character.health -= damage;
    if (this[`teamMember${charId}`].character.health <= 0) {
      delete this[`teamMember${charId}`];
    }
  }

  teamLevelUp() {
    const arrayCharacters = [];
    for (let key in this) {
      this[key].character.levelUp();
      arrayCharacters.push(this[key].character);
    }
    return { characters: arrayCharacters };
  }

  getPoints() {
    let sum = 0;
    for (let key in this) {
      sum += this[key].character.attack + this[key].character.defence;
    }
    return sum;
  }
}