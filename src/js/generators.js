import Team from './Team'
import Bowman from './characters/Bowman'
import Daemon from './characters/Daemon'
import Magician from './characters/Magician'
import Swordsman from './characters/Swordsman'
import Undead from './characters/Undead'
import Vampire from './characters/Vampire'


/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const lev = Math.floor((Math.random() * (maxLevel - 1)) + 1);
    const randomIndex = Math.floor(Math.random() * allowedTypes.length);
    yield new allowedTypes[randomIndex](lev);
  }
  // TODO: write logic here
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];
  const generator = characterGenerator(allowedTypes, maxLevel);
  for(let i = 0; i < characterCount; i++) {
    let character = generator.next().value;
    characters.push(character);
  }
  return new Team(characters);
  // TODO: write logic here
}


