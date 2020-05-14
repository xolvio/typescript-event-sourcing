import {GivenWhenThen} from '../../es-cqrs/GivenWhenThen'
import {guid} from '../../es-cqrs/Guid'
import {File} from './File'
import {RenameFile} from './FileCommands'
import {FileCreated, FileRenamed} from './FileEvents'
import {MissingParameterError} from '../../es-cqrs/Errors'

const GWT = GivenWhenThen(`${__dirname}/File`)

test('Rename file', () =>
  GWT((Given, When, Then) => {
    const fileId = guid()

    Given(new FileCreated(fileId, 'foo'))
    When(new RenameFile(fileId, 'bar', 1))
    Then(new FileRenamed(fileId, 'bar'))
  }))

test('Rename file fail', () =>
  GWT((Given, When, Then) => {
    const fileId = guid()

    Given(new FileCreated(fileId, 'foo'))
    When(new RenameFile(fileId, '', 1))
    expect((): void => {
      Then(new FileRenamed(fileId, 'bar'))
    }).toThrow(MissingParameterError)
  }))
