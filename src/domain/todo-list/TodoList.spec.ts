import {GivenWhenThen} from '../../framework/GivenWhenThen'
import {guid} from '../../framework/Guid'
import {
  AddTodoToList,
  CreateTodoList,
  MarkTodoAsComplete,
  RenameTodoList,
} from './TodoListCommands'
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

const GWT = GivenWhenThen(`${__dirname}/TodoList`)

test('Create todoList', () =>
  GWT((Given, When, Then) => {
    const todoListId = guid()

    When(new CreateTodoList(todoListId, 'bar'))
    Then(new TodoListCreated(todoListId, 'bar'))
  }))

test('Rename todoList', () =>
  GWT((Given, When, Then) => {
    const todoListId = guid()

    Given(new TodoListCreated(todoListId, 'foo'))
    When(new RenameTodoList(todoListId, 'bar', 1))
    Then(new TodoListRenamed(todoListId, 'bar'))
  }))

test('Rename todoList fail', () =>
  GWT((Given, When, Then) => {
    const todoListId = guid()

    Given(new TodoListCreated(todoListId, 'foo'))
    When(new RenameTodoList(todoListId, '', 1))
    expect((): void => {
      Then(new TodoListRenamed(todoListId, 'bar'))
    }).toThrow(MissingParameterError)
  }))

test('Add todo to list', () =>
  GWT((Given, When, Then) => {
    const todoListId = guid()

    Given(new TodoListCreated(todoListId, 'foo'))
    When(new AddTodoToList(todoListId, 'feed the cat', 1))
    Then(new TodoAddedToList(todoListId, 'feed the cat'))
  }))

test('Add todo to list fails for duplicate name todos', () =>
  GWT((Given, When, Then) => {
    const todoListId = guid()

    Given(
      new TodoListCreated(todoListId, 'foo'),
      new TodoAddedToList(todoListId, 'feed the cat')
    )
    When(new AddTodoToList(todoListId, 'feed the cat', 1))
    expect((): void => {
      Then(new TodoAddedToList(todoListId, 'feed the cat'))
    }).toThrow(DuplicateEntryError)
  }))

test('Mark todo as complete', () =>
  GWT((Given, When, Then) => {
    const todoListId = guid()

    Given(
      new TodoListCreated(todoListId, 'foo'),
      new TodoAddedToList(todoListId, 'feed Bob')
    )
    When(new MarkTodoAsComplete(todoListId, 'feed Bob', 1))
    Then(new TodoMarkedAsComplete(todoListId, 'feed Bob'))
  }))

test('Mark todo as complete fails', () =>
  GWT((Given, When, Then) => {
    const todoListId = guid()

    Given(new TodoListCreated(todoListId, 'foo'))
    When(new MarkTodoAsComplete(todoListId, 'feed Bob', 1))
    expect((): void => {
      Then(new TodoMarkedAsComplete(todoListId, 'feed Bob'))
    }).toThrow(NotFoundError)
  }))
