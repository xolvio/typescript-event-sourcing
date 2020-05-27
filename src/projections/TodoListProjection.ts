import {IMessageBus} from '../framework/IMessageBus'
import {
  TodoAddedToList,
  TodoListCreated,
} from '../domain/todo-list/TodoListEvents'

export class TodoListProjection {
  public todoLists = {}

  constructor(private messageBus: IMessageBus) {
    messageBus.registerEventHandler(TodoListCreated, (e) => {
      const event = e as TodoListCreated
      this.todoLists[event.aggregateId] = event
    })
    messageBus.registerEventHandler(TodoAddedToList, (e) => {
      const event = e as TodoAddedToList
      if (!this.todoLists[event.aggregateId].todos) {
        this.todoLists[event.aggregateId].todos = []
      }
      this.todoLists[event.aggregateId].todos.push({name: event.todoName})
    })
  }
}
