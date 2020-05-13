import {IMessageBus} from './IMessageBus'
import {IMessage} from './IMessage'
import {Command} from './Command'
import {Event} from './Event'

export class MessageBus implements IMessageBus {
  private _eventHandlerFor = {}
  private _commandHandlersFor = {}

  registerEventHandler<T extends Event>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    handler: (e: IMessage) => void
  ): void {
    if (!this._eventHandlerFor[event.name])
      this._eventHandlerFor[event.name] = []
    this._eventHandlerFor[event.name].push(handler)
  }

  registerCommandHandlers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commandHandler: any
  ): void {
    Object.keys(commands).forEach((commandName) => {
      if (!commandHandler[`handle${commandName}`])
        throw new Error(
          `Could not find handle${commandName} in ${commandHandler.constructor.name}.`
        )
      this._commandHandlersFor[commandName] = commandHandler
    })
  }

  send<T extends Command>(command: T): void {
    const commandName = command.constructor.name
    if (!this._commandHandlersFor[commandName])
      throw new Error(`No handler registered for ${commandName}`)

    this._commandHandlersFor[commandName][`handle${commandName}`](command)
  }

  publish<T extends Event>(event: T): void {
    const eventName = event.constructor.name
    if (this._eventHandlerFor[eventName])
      this._eventHandlerFor[eventName].forEach((handler) => handler(event))
  }
}
