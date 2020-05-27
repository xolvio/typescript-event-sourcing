import {IMessage} from './IMessage'

export class Event implements IMessage {
  constructor(public readonly aggregateId: string) {}
}
