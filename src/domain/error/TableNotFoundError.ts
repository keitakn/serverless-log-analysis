export default class TableNotFoundError extends Error {
  constructor() {
    const message = "Table does not exist";

    super(message);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
