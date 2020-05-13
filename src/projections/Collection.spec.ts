import {GivenWhenThen} from '../es-cqrs/GivenWhenThen'
import {Branch} from '../domain/branch/Branch'
import {BranchCreated, BranchRenamed} from '../domain/branch/BranchEvents'
import {Collection} from './Collection'

const GWT = GivenWhenThen(Branch, `${__dirname}/../domain/branch`)

test('Collection Projection', () =>
  GWT((Given, When, Then, messageBus) => {
    const collection = new Collection(messageBus)

    Given(new BranchCreated('1234', 'foo'), new BranchCreated('5678', 'bar'))

    expect(collection.branches['1234'].name).toEqual('foo')
    expect(collection.branches['5678'].name).toEqual('bar')
  }))

test('Collection Projection', () =>
  GWT((Given, When, Then, messageBus) => {
    const collection = new Collection(messageBus)

    Given(
      new BranchCreated('1234', 'foo'),
      new BranchCreated('5678', 'bar'),
      new BranchRenamed('5678', 'baz')
    )

    expect(collection.branches['1234'].name).toEqual('foo')
    expect(collection.branches['5678'].name).toEqual('baz')
  }))
