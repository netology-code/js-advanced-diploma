import { themesGenerator } from "../themes";

test("themes generate", () => {
  const themesGen = themesGenerator();
  const result1 = themesGen.next().value;
  const result2 = themesGen.next().value;
  const expectings1 = "prairie";
  const expectings2 = "desert";
  expect(result1).toEqual(expectings1);
  expect(result2).toEqual(expectings2);
});
