const themes = {
  themes: {
    prairie: 'prairie',
    desert: 'desert',
    arctic: 'arctic',
    mountain: 'mountain',
  },
  * get(theme) {
    const values = Object.values(this.themes);
    const themeIndex = values.findIndex((el) => el === theme);
    let index = themeIndex !== -1 ? themeIndex % values.length : 0;
    while (true) {
      yield values[index];
      index = ++index % values.length === 0 ? 0 : index % values.length;
    }
  },
};

export default themes;
