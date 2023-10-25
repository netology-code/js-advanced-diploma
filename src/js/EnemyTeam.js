import PositionedCharacter from './PositionedCharacter';
import Character from './Character';

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

  setDamage(charId, attack) {
    const damage = Math.trunc(Math.max(attack - this[`teamMember${charId}`].character.defence, attack * 0.1));
    this[`teamMember${charId}`].character.health -= damage;
    if (this[`teamMember${charId}`].character.health <= 0) {
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
}
