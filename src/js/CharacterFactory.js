import {
  Bowman, Swordsman, Magician, Vampire, Undead, Daemon,
} from './Characters/Characters';

export default class CharacterFactory {
  static createFromObject(obj) {
    const charClasses = [
      Bowman,
      Swordsman,
      Magician,
      Vampire,
      Undead,
      Daemon,
    ];
    const CharClassName = charClasses.find(item => item.name.toLowerCase() === obj.type);
    const charClass = new CharClassName();
    console.log('before', charClass);
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        charClass[prop] = obj[prop];
      }
    }
    console.log('after', charClass);
    return charClass;
  }
}
