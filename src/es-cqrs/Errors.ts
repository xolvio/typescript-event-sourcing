export class ConcurrencyViolationError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class MissingParameterError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
