import { randomUUID } from 'node:crypto';

export abstract class Nota {
  private _id: string;
  constructor(private _type: symbol) {
    this._id = randomUUID();
  }

  get id() {
    return this._id;
  }
  get type() {
    return this._type;
  }
}
