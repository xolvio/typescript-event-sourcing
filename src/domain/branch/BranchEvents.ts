import {Event} from '../../es-cqrs/Event'

export class BranchCreated extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string
  ) {
    super(aggregateId)
  }
}

export class BranchRenamed extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string
  ) {
    super(aggregateId)
  }
}
