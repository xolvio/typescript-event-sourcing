// eslint-disable @typescript-eslint/no-var-requires
import {Event} from './Event'
import {Command} from './Command'
import {MessageBus} from './MessageBus'
import {EventStore} from './EventStore'
import {Repository} from './Repository'

export function GivenWhenThen(aggregatePath: string): Function {
  return (cb: Function): Function => {
    const dir = aggregatePath.substring(0, aggregatePath.lastIndexOf('/'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function req(moduleName, extract = false): any {
      if (extract)
        // eslint-disable-next-line global-require,import/no-dynamic-require
        return require(`${dir}/${moduleName}`)[`${moduleName}`]
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return require(`${dir}/${moduleName}`)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const aggregateName = aggregatePath.substring(
      aggregatePath.lastIndexOf('/') + 1
    )

    const Aggregate = req(aggregateName, true)
    const AggregateCommandHandlers = req(
      `${aggregateName}CommandHandlers`,
      true
    )
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
    const AggregateCommands = require(`${dir}/${aggregateName}Commands`)

    const messageBus = new MessageBus()
    const eventStore = new EventStore(messageBus)
    const repository = new Repository(eventStore, Aggregate)

    messageBus.registerCommandHandlers(
      AggregateCommands,
      new AggregateCommandHandlers(repository)
    )

    function Given(...events: Event[]): void {
      events.forEach((event) => {
        eventStore.saveEvents(event.aggregateId, [event], 1)
      })
    }

    let whenCallback

    function When(...commands: Command[]): void {
      whenCallback = (): void => {
        commands.forEach((command) => messageBus.send(command))
      }
    }

    function Then(...expectedEvents: Event[]): void {
      expectedEvents.forEach((expectedEvent) => {
        messageBus.registerEventHandler(
          expectedEvent.constructor,
          (actualEvent) => {
            expect(actualEvent).toEqual(expectedEvent)
          }
        )
      })
      whenCallback()
    }

    return cb(Given, When, Then, messageBus)
  }
}
