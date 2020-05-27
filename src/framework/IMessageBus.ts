import {IMessage} from './IMessage'
import {Command} from './Command'
import {Event} from './Event'

export interface IMessageBus {
  registerEventHandler<T extends Event>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    handler: (e: IMessage) => void
  ): void
  registerCommandHandlers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handlers: any
  ): void
  send<T extends Command>(command: T): void
  publish<T extends Event>(event: T): void
}
