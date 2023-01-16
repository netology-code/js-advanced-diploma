export default class AI {
  constructor(gameState) {
    this.gameState = gameState;
  }

  getMovingCharacter() {
    const { charactersPositions } = this.gameState;
    const enemyTeam = charactersPositions.filter((el) =>
      this.gameState.enemyTypes.some((type) => el.character instanceof type)
    );
    const aiCharacter = enemyTeam[Math.floor(Math.random() * enemyTeam.length)];
    return aiCharacter;
  }

  selectTarget() {}

  move() {
    const enemy = this.getMovingCharacter();
    const aiCharacter = selectCharacter.call(
      this,
      enemy,
      this.gamePlay.boardSize
    );
    console.log(aiCharacter);
  }
}
