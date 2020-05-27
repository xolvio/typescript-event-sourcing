import {AggregateRoot} from '../../framework/AggregateRoot'
import {
  TodoAddedToList,
  TodoListCreated,
  TodoListRenamed,
  TodoMarkedAsComplete,
} from './TodoListEvents'
import {
  DuplicateEntryError,
  MissingParameterError,
  NotFoundError,
} from '../../framework/Errors'

class Todo {
  complete: boolean
  constructor(public readonly name: string) {}
}

export class TodoList extends AggregateRoot {
  private name: string
  private todos: Todo[] = []

  constructor(guid: string, name: string) {
    super()
    this.applyChange(new TodoListCreated(guid, name))
  }
  applyTodoListCreated(event: TodoListCreated): void {
    this._id = event.aggregateId
    this.name = event.name
  }

  rename(name: string): void {
    if (!name) throw new MissingParameterError('Must provide a name')
    this.applyChange(new TodoListRenamed(this._id, name))
  }
  applyTodoListRenamed(event: TodoListRenamed): void {
    this._id = event.aggregateId
    this.name = event.name
  }

  addTodo(todoName: string): void {
    if (this.todos.find((todo) => todo.name === todoName)) {
      throw new DuplicateEntryError(`${todoName} already exists`)
    }
    this.applyChange(new TodoAddedToList(this._id, todoName))
  }
  applyTodoAddedToList(event: TodoAddedToList): void {
    this.todos.push(new Todo(event.todoName))
  }

  markTodoAsComplete(todoName: string): void {
    if (!this.todos.find((todo) => todo.name === todoName)) {
      throw new NotFoundError(`${todoName} not found`)
    }
    this.applyChange(new TodoMarkedAsComplete(this._id, todoName))
  }
  applyTodoMarkedAsComplete(event: TodoMarkedAsComplete): void {
    const matchedTodo = this.todos.find(
      (todo: Todo) => todo.name === event.todoName
    )
    matchedTodo.complete = true
  }
}
