import Team from "../Team";
import Bowman from "../characters/Bowman";

test("new Team(arr)", () => {
  const expectings = [new Bowman(), new Bowman()];
  const char1 = new Bowman();
  const char2 = new Bowman();
  const result = new Team([char1, char2]);
  expect(result.characters).toEqual(expectings);
});
