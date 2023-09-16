import {BoardElement} from "./BoardElement.js";
import {EventBus} from "./EventBus.js";

export class Food extends BoardElement{
  position;

  constructor({ctx, boardSize, step, border, color = 'red'}) {
    super({ctx, boardSize, border, step, color})
    this.position = generateRandomCoordinates(this._boardSize, this._step, this._border);
    EventBus.publish('new-obstacle-coordinates', {name: 'food', x: this.position.x, y: this.position.y});
    EventBus.subscribe('snake-found-food', () => this.update())
  }

  createNewCoordinates() {
    this.position = generateRandomCoordinates(this._boardSize, this._step, this._border)
    EventBus.publish('new-obstacle-coordinates', {name: 'food', x: this.position.x, y: this.position.y});
  }

  draw(isNew = false) {
    if (isNew) this.createNewCoordinates()
    this._ctx.fillStyle = this._color;
    this._ctx.fillRect(this.position.x, this.position.y, this._step, this._step)
  }

  update(){
    this.draw(true)
  }
}

const generateRandomCoordinates = (boardSize, step, border) => {
  let x = Math.floor(Math.random()*(boardSize-border)/step)*step;
  let y = Math.floor(Math.random()*(boardSize-border)/step)*step;

  if(border && (x <= border || x >= boardSize - border)) x = border+step;
  if(border && (y <= border || y >= boardSize - border)) y = border+step;

  return {x, y}
}