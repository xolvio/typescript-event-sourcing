import {Command} from '../../framework/Command'

export class CreateTodoList extends Command {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string
  ) {
    super(-1)
  }
}

export class AddTodoToList extends Command {
  constructor(
    public readonly aggregateId: string,
    public readonly todoName: string,
    public readonly expectedAggregateVersion: number
  ) {
    super(expectedAggregateVersion)
  }
}

export class MarkTodoAsComplete extends Command {
  constructor(
    public readonly aggregateId: string,
    public readonly todoName: string,
    public readonly expectedAggregateVersion: number
  ) {
    super(expectedAggregateVersion)
  }
}

export class RenameTodoList extends Command {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string,
    public readonly expectedAggregateVersion: number
  ) {
    super(expectedAggregateVersion)
  }
}
