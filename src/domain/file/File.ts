import {AggregateRoot} from '../../es-cqrs/AggregateRoot'
import {FileCreated, FileRenamed} from './FileEvents'
import {MissingParameterError} from '../../es-cqrs/Errors'

export class File extends AggregateRoot {
  private name: string

  constructor(guid: string, name: string) {
    super()
    this.applyChange(new FileCreated(guid, name))
  }

  applyFileCreated(event: FileCreated): void {
    this._id = event.aggregateId
    this.name = event.name
  }

  applyFileRenamed(event: FileRenamed): void {
    this._id = event.aggregateId
    this.name = event.name
  }

  rename(name: string): void {
    if (!name) throw new MissingParameterError('Must provide a name')
    this.applyChange(new FileRenamed(this._id, name))
  }
}
