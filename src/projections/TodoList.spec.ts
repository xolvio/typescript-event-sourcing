import {GivenWhenThen} from '../framework/GivenWhenThen'
import {
  TodoAddedToList,
  TodoListCreated,
} from '../domain/todo-list/TodoListEvents'
import {TodoListProjection} from './TodoListProjection'

const GWT = GivenWhenThen(`${__dirname}/../domain/todo-list/TodoList`)

test('Collected multiple todo lists', () =>
  GWT((Given, When, Then, messageBus) => {
    const todoList = new TodoListProjection(messageBus)

    Given(
      new TodoListCreated('1234', 'foo'),
      new TodoListCreated('2345', 'bar'),
      new TodoListCreated('3456', 'baz')
    )

    expect(todoList.todoLists['1234'].name).toEqual('foo')
    expect(todoList.todoLists['2345'].name).toEqual('bar')
    expect(todoList.todoLists['3456'].name).toEqual('baz')
  }))

test('Todo lists contain added todo items', () =>
  GWT((Given, When, Then, messageBus) => {
    const todoList = new TodoListProjection(messageBus)

    Given(
      new TodoListCreated('1234', 'foo'),
      new TodoAddedToList('1234', 'buy biscuits'),
      new TodoAddedToList('1234', 'buy peanuts')
    )

    expect(todoList.todoLists['1234'].todos[0].name).toEqual('buy biscuits')
    expect(todoList.todoLists['1234'].todos[1].name).toEqual('buy peanuts')
  }))
