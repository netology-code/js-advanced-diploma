import Team from './Team';
import PositionedCharacter from './PositionedCharacter';

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
export function* characterGenerator(types, maxLevel) {
  while (true) {
    const character = new types[Math.floor(Math.random() * types.length)](1);
    const charLevel = Math.ceil(Math.random() * maxLevel);
    if (charLevel > 1) {
      for (let i = 1; i < charLevel; i += 1) {
        character.levelUp();
      }
    }
    yield character;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i += 1) {
    characters.push(playerGenerator.next().value);
  }
  return new Team(characters);
}

export function playersInit(team, arrayPositions) {
  const positionedCharacterArray = [];
  team.characters.forEach((el) => {
    const randomIdx = Math.floor(arrayPositions.length * Math.random());
    positionedCharacterArray.push(new PositionedCharacter(el, arrayPositions[randomIdx]));
    arrayPositions.splice(randomIdx, 1);
  });
  return positionedCharacterArray;
}
