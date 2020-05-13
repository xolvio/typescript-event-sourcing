import {AggregateRoot} from '../../es-cqrs/AggregateRoot'
import {BranchCreated, BranchRenamed} from './BranchEvents'
import {MissingParameterError} from '../../es-cqrs/Errors'

export class Branch extends AggregateRoot {
  private name: string

  constructor(guid: string, name: string) {
    super()
    this.applyChange(new BranchCreated(guid, name))
  }

  applyBranchCreated(event: BranchCreated): void {
    this._id = event.aggregateId
    this.name = event.name
  }

  applyBranchRenamed(event: BranchRenamed): void {
    this._id = event.aggregateId
    this.name = event.name
  }

  rename(name: string): void {
    if (!name) throw new MissingParameterError('Must provide a name')
    this.applyChange(new BranchRenamed(this._id, name))
  }
}
