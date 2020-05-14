import {IMessageBus} from '../es-cqrs/IMessageBus'
import {FileCreated, FileRenamed} from '../domain/file/FileEvents'

export class FileTree {
  public files = {}

  constructor(private messageBus: IMessageBus) {
    messageBus.registerEventHandler(FileCreated, (e) => {
      const event = e as FileCreated
      this.files[event.aggregateId] = event
    })
    messageBus.registerEventHandler(FileRenamed, (e) => {
      const event = e as FileRenamed
      this.files[event.aggregateId].name = event.name
    })
  }
}
