import {GivenWhenThen} from '../../es-cqrs/GivenWhenThen'
import {guid} from '../../es-cqrs/Guid'
import {Branch} from './Branch'
import {RenameBranch} from './BranchCommands'
import {BranchCreated, BranchRenamed} from './BranchEvents'
import {MissingParameterError} from '../../es-cqrs/Errors'

const GWT = GivenWhenThen(Branch, __dirname)

test('Rename branch', () =>
  GWT((Given, When, Then) => {
    const branchId = guid()

    Given(new BranchCreated(branchId, 'foo'))
    When(new RenameBranch(branchId, 'bar', 1))
    Then(new BranchRenamed(branchId, 'bar'))
  }))

test('Rename branch fail', () =>
  GWT((Given, When, Then) => {
    const branchId = guid()

    Given(new BranchCreated(branchId, 'foo'))
    When(new RenameBranch(branchId, '', 1))
    expect((): void => {
      Then(new BranchRenamed(branchId, 'bar'))
    }).toThrow(MissingParameterError)
  }))
