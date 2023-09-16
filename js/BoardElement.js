export class BoardElement {
  _color;
  _boardSize
  _step
  _border
  _ctx
  constructor({ctx, boardSize, step, border = 0, color = 'black'}) {
    this._color = color;
    this._boardSize = boardSize;
    this._step = step;
    this._border = border;
    this._ctx = ctx;
  }
}