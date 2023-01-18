import themes from '../themes';

test('themes generate', () => {
  const themesGenerator = themes.get(themes.themes.prairie);
  const result1 = themesGenerator.next().value;
  const result2 = themesGenerator.next().value;
  const expectings1 = 'prairie';
  const expectings2 = 'desert';
  expect(result1).toEqual(expectings1);
  expect(result2).toEqual(expectings2);
});
