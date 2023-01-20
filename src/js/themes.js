const themes = {
  prairie: "prairie",
  desert: "desert",
  arctic: "arctic",
  mountain: "mountain",
};

const themesGenerator = function* (startTheme = themes.prairie) {
  const values = Object.values(themes);
  const themeIndex = values.findIndex((el) => el === startTheme);
  let index = themeIndex !== -1 ? themeIndex % values.length : 0;
  while (true) {
    yield values[index];
    index = ++index % values.length === 0 ? 0 : index % values.length;
  }
};

export { themes, themesGenerator };
