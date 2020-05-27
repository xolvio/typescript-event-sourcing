import {IEventStore} from './IEventStore'
import {AggregateRoot} from './AggregateRoot'

export interface IRepository<T extends AggregateRoot> {
  save(T, expectedVersion: number): void
  getById(id: string): T
}

export class Repository<T extends AggregateRoot> implements IRepository<T> {
  constructor(
    private readonly _storage: IEventStore,
    private Type: new () => T
  ) {}

  save(T, expectedVersion: number): void {
    this._storage.saveEvents(T.id, T.getUncommittedChanges(), expectedVersion)
    T.markChangesAsCommitted()
  }

  getById(id: string): T {
    const domainObject = new this.Type() as T
    const history = this._storage.getEventsForAggregate(id)
    domainObject.loadFromHistory(history)
    return domainObject
  }
}
