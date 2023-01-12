export default class GameState {
  constructor({
    players = {
      player: "player",
      computer: "computer",
    },
    moving = players.player,
    points = 0,
    maxPoints = 0,
  }) {
    this.moving = moving;
    this.players = players;
    this.points = points;
    this.maxPoints = maxPoints;
  }

  nextMove() {
    this.moving =
      this.moving === this.players.player
        ? this.players.computer
        : this.players.player;
  }

  static from(object) {
    // TODO: create object
    return new GameState({
      players: object.players
        ? object.players
        : { player: "player", computer: "computer" },
      moving: object.moving ? object.moving : object.players.player,
      points: object.points ? object.points : 0,
      maxPoints:
        object.points > object.maxPoints ? object.points : object.maxPoints,
    });
  }
}
