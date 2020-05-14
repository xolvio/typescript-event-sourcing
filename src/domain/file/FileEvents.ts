import {Event} from '../../es-cqrs/Event'

export class FileCreated extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string
  ) {
    super(aggregateId)
  }
}

export class FileRenamed extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string
  ) {
    super(aggregateId)
  }
}
