let themes = {
  themes: {
    prairie: "prairie",
    desert: "desert",
    arctic: "arctic",
    mountain: "mountain",
  },
  get: function* (indexStart) {
    const values = Object.values(this.themes);
    let index = indexStart !== undefined ? indexStart % values.length : 0;
    while (true) {
      yield values[index];
      index = ++index % values.length === 0 ? 0 : index % values.length;
    }
  },
};

export default themes;
