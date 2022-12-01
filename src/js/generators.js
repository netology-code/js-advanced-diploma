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
  // TODO: write logic here
  while (true) {
    const tipe = Math.floor(Math.random() * allowedTypes.length);
    const level = Math.floor(Math.random() * maxLevel) + 1;
    yield new allowedTypes[tipe](level);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  const character = characterGenerator(allowedTypes, maxLevel);

  while (team.length < characterCount) {
    team.push(character.next().value);
  }

  return team;
}
