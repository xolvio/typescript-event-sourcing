import {IMessageBus} from '../es-cqrs/IMessageBus'
import {BranchCreated, BranchRenamed} from '../domain/branch/BranchEvents'

export class Collection {
  public branches = {}

  constructor(private messageBus: IMessageBus) {
    messageBus.registerEventHandler(BranchCreated, (e) => {
      const event = e as BranchCreated
      this.branches[event.aggregateId] = event
    })
    messageBus.registerEventHandler(BranchRenamed, (e) => {
      const event = e as BranchRenamed
      this.branches[event.aggregateId].name = event.name
    })
  }
}
