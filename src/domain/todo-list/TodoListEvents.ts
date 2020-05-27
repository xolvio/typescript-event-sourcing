import {Event} from '../../framework/Event'

export class TodoListCreated extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string
  ) {
    super(aggregateId)
  }
}

export class TodoAddedToList extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly todoName: string
  ) {
    super(aggregateId)
  }
}

export class TodoMarkedAsComplete extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly todoName: string
  ) {
    super(aggregateId)
  }
}

export class TodoListRenamed extends Event {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string
  ) {
    super(aggregateId)
  }
}
