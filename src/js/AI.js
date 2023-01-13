import GameController from "./GameController";

export default class AI {
  constructor(gameState) {
    this.gameState = gameState;
  }

  getCharacter() {
    const { charactersPositions } = this.gameState;
    const enemyTeam = charactersPositions.filter((el) =>
      this.gameState.enemyTypes.some((type) => el.character instanceof type)
    );
    const aiCharacter = enemyTeam[Math.floor(Math.random() * enemyTeam.length)];
    return aiCharacter;
  }

  move() {
    const aiCharacter = GameController.selectCharacter(this.getCharacter());
    console.log(aiCharacter);
  }
}
