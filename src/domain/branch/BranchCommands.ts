import {Command} from '../../es-cqrs/Command'

export class CreateBranch extends Command {
  constructor(public readonly name: string) {
    super(-1)
  }
}

export class RenameBranch extends Command {
  constructor(
    public readonly aggregateId: string,
    public readonly name: string,
    public readonly expectedAggregateVersion: number
  ) {
    super(expectedAggregateVersion)
  }
}
