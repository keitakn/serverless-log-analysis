export default class DatabaseNotFoundError extends Error {
  constructor() {
    const message = "Database does not exist";

    super(message);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
