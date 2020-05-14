import {IRepository} from '../../es-cqrs/Repository'
import {File} from './File'
import {CreateFile, RenameFile} from './FileCommands'
import {guid} from '../../es-cqrs/Guid'

export class FileCommandHandlers {
  constructor(private _repository: IRepository<File>) {}

  handleCreateFile(command: CreateFile): void {
    const file = new File(guid(), command.name)
    this._repository.save(file, -1)
  }

  handleRenameFile(command: RenameFile): void {
    const file = this._repository.getById(command.aggregateId)
    file.rename(command.name)
    this._repository.save(file, command.expectedAggregateVersion)
  }
}
