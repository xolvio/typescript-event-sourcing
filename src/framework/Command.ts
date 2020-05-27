import {IMessage} from './IMessage'

export class Command implements IMessage {
  constructor(public readonly expectedAggregateVersion: number) {}
}
