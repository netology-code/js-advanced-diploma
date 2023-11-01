import PositionedCharacter from './PositionedCharacter';
import Character from './Character';

export default class OwnTeam {
  constructor(positionedCharacterArray) {
    for (let i = 0; i < positionedCharacterArray.length; i += 1) {
      const { character } = positionedCharacterArray[i];
      if (Object.prototype.hasOwnProperty.call(character, 'id')) {
        Object.setPrototypeOf(character, Character.prototype);
      } else {
        character.id = i + 1;
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

  setNewPosition(charId, newPosition) {
    Object.keys(this).forEach((key) => {
      if (+this[key].character.id === +charId) {
        this[key].position = newPosition;
      }
    });
  }

  getTarget() {
    return this.getPositionedCharacters().reduce((acc, item) => {
      if (item.character.defence < acc[0]) {
        return [item.character.defence, item.character.id];
      }
      return acc;
    }, [500, {}])[1];
  }

  setDamage(charId, attack, callback) {
    const damage = Math.trunc(Math.max(attack - this[`teamMember${charId}`].character.defence, attack * 0.1));
    this[`teamMember${charId}`].character.health -= damage;
    if (this[`teamMember${charId}`].character.health <= 0) {
      callback(true);
      delete this[`teamMember${charId}`];
    } else {
      callback(false);
    }
  }

  teamLevelUp() {
    const arrayCharacters = [];
    Object.values(this).forEach((value) => {
      value.character.levelUp();
      arrayCharacters.push(value.character);
    });
    return { characters: arrayCharacters };
  }

  getScore() {
    let sum = 0;
    Object.values(this).forEach((value) => {
      sum += value.character.attack + value.character.defence;
    });
    return sum;
  }
}
