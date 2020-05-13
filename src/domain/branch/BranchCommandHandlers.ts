import {IRepository} from '../../es-cqrs/Repository'
import {Branch} from './Branch'
import {CreateBranch, RenameBranch} from './BranchCommands'
import {guid} from '../../es-cqrs/Guid'

export class BranchCommandHandlers {
  constructor(private _repository: IRepository<Branch>) {}

  handleCreateBranch(command: CreateBranch): void {
    const branch = new Branch(guid(), command.name)
    this._repository.save(branch, -1)
  }

  handleRenameBranch(command: RenameBranch): void {
    const branch = this._repository.getById(command.aggregateId)
    branch.rename(command.name)
    this._repository.save(branch, command.expectedAggregateVersion)
  }
}
