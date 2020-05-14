import {GivenWhenThen} from '../es-cqrs/GivenWhenThen'
import {FileCreated, FileRenamed} from '../domain/file/FileEvents'
import {FileTree} from './FileTree'

const GWT = GivenWhenThen(`${__dirname}/../domain/file/File`)

test('FileTree Projection', () =>
  GWT((Given, When, Then, messageBus) => {
    const fileTree = new FileTree(messageBus)

    Given(
      new FileCreated('1234', 'foo'),
      new FileCreated('2345', 'bar'),
      new FileCreated('3456', 'baz')
    )

    expect(fileTree.files['1234'].name).toEqual('foo')
    expect(fileTree.files['2345'].name).toEqual('bar')
    expect(fileTree.files['3456'].name).toEqual('baz')
  }))

test('FileTree Projection', () =>
  GWT((Given, When, Then, messageBus) => {
    const fileTree = new FileTree(messageBus)

    Given(
      new FileCreated('1234', 'foo'),
      new FileCreated('5678', 'bar'),
      new FileRenamed('5678', 'baz')
    )

    expect(fileTree.files['1234'].name).toEqual('foo')
    expect(fileTree.files['5678'].name).toEqual('baz')
  }))
