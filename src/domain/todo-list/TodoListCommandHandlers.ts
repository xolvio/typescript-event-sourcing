import {IRepository} from '../../framework/Repository'
import {TodoList} from './TodoList'
import {
  AddTodoToList,
  CreateTodoList,
  MarkTodoAsComplete,
  RenameTodoList,
} from './TodoListCommands'

export class TodoListCommandHandlers {
  constructor(private _repository: IRepository<TodoList>) {}

  handleCreateTodoList(command: CreateTodoList): void {
    const todoList = new TodoList(command.aggregateId, command.name)
    this._repository.save(todoList, -1)
  }

  handleRenameTodoList(command: RenameTodoList): void {
    const todoList = this._repository.getById(command.aggregateId)
    todoList.rename(command.name)
    this._repository.save(todoList, command.expectedAggregateVersion)
  }

  handleAddTodoToList(command: AddTodoToList): void {
    const todoList = this._repository.getById(command.aggregateId)
    todoList.addTodo(command.todoName)
    this._repository.save(todoList, command.expectedAggregateVersion)
  }

  handleMarkTodoAsComplete(command: MarkTodoAsComplete): void {
    const todoList = this._repository.getById(command.aggregateId)
    todoList.markTodoAsComplete(command.todoName)
    this._repository.save(todoList, command.expectedAggregateVersion)
  }
}
