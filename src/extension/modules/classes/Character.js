export default class Character {
  constructor(name, ddbID, player) {
    this.name = name;
    this.ddbID = ddbID;
    this.player = player;
    this.replicant = ddbID;
    this.timestamp = undefined;
    this.hidden = false;
    this.data = {};
    this.override = {};
  }
}
