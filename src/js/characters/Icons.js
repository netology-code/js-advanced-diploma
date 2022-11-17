const icons = {
  level: '\u{1f396}',
  attack: '\u{2694}',
  defence: '\u{1F6E1}',
  health: '\u{2764}',
};

export default function propIcons(character) {
  const properties = `${icons.level}${character.level} ${icons.attack}${character.attack} ${icons.defence}${character.defence} ${icons.health}${character.health}`;
  return properties;
}
