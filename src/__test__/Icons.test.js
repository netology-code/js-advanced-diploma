import Swordsman from '../js/characters/Swordsman';
import propIcons from '../js/characters/Icons';

test('returns info about character with icons', () => {
  const dennyBlindEyes = new Swordsman(1);
  const received = propIcons(dennyBlindEyes);
  const expected = `${'\u{1F396}'}1 ${'\u{2694}'}40 ${'\u{1F6E1}'}0 ${'\u{2764}'}50`;
  expect(received).toBe(expected);
});
