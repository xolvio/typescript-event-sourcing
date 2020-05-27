import {Event} from './Event'

export interface IEventStore {
  saveEvents(
    aggregateId: string,
    events: Event[],
    expectedVersion: number
  ): void
  getEventsForAggregate(aggregateId: string): Event[]
}
