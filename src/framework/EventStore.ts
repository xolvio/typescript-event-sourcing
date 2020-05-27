import {IEventStore} from './IEventStore'
import {IMessageBus} from './IMessageBus'
import {Event} from './Event'
import {ConcurrencyViolationError} from './Errors'

class EventDescriptor {
  constructor(
    public readonly aggregateId: string,
    public readonly event: Event,
    public readonly version: number
  ) {}
}

export class EventStore implements IEventStore {
  events = {}

  constructor(private messageBus: IMessageBus) {}

  getEventsForAggregate(aggregateId: string): Event[] {
    return this.events[aggregateId].map(
      (eventDescriptor) => eventDescriptor.event
    )
  }

  saveEvents(
    aggregateId: string,
    newEvents: Event[],
    expectedAggregateVersion: number
  ): void {
    if (!this.events[aggregateId]) {
      this.events[aggregateId] = []
    }

    const lastEventDescriptor = this.getLastEventDescriptor(aggregateId)
    if (
      this.events[aggregateId].length > 0 &&
      lastEventDescriptor.version !== expectedAggregateVersion
    ) {
      throw new ConcurrencyViolationError(
        'An operation has been performed on an aggregate root that is out of date.'
      )
    }
    let i = 0
    newEvents.forEach((event: Event) => {
      i += 1
      this.events[aggregateId].push(new EventDescriptor(aggregateId, event, i))
    })

    this.publish(newEvents)
  }

  private getLastEventDescriptor(aggregateId: string): EventDescriptor {
    return this.events[aggregateId][this.events[aggregateId].length - 1]
  }

  private publish(events: Event[]): void {
    events.forEach((event: Event) => this.messageBus.publish(event))
  }
}
