// @flow

import {GraphQLScalarType} from 'graphql'
import { Kind } from 'graphql/language'
import moment from 'moment'

const SUPPORTED_FORMAT = [
  'HH',
  'HH:mm',
  'HH:mm:ss',
  'HH:mm:ss.SSS'
]

const RESULT_FORMAT = 'HH:mm:ss.SSS'

export default new GraphQLScalarType({
  name: 'LocalTime',
  description: 'A time without a time-zone in the ISO-8601 calendar system, such as 10:15:30.000.',
  serialize (value: mixed): string {
    if (value instanceof Date) {
      const time = value.getTime()
      if (time === time) { // eslint-disable-line
        return moment(value).format(RESULT_FORMAT)
      }
      throw new TypeError('LocalTime cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      const momentDate = moment(value, SUPPORTED_FORMAT, true)
      if (momentDate.isValid()) {
        return value
      }
      throw new TypeError(
        `LocalTime cannot represent an invalid ISO 8601 time-string ${value}. ` +
        `You must provide a valid time-string in one of the following formats: ${SUPPORTED_FORMAT.toString()}.`
      )
    } else {
      throw new TypeError(
        'LocalTime cannot be serialized from a non string, ' +
        'or non Date type ' + JSON.stringify(value)
      )
    }
  },
  parseValue (value: mixed): Date {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `LocalTime cannot represent non string type ${JSON.stringify(value)}`
      )
    }

    // Need to check that it is a string in the correct format
    const momentDate = moment(value, SUPPORTED_FORMAT, true)
    if (momentDate.isValid()) {
      return momentDate.toDate()
    }
    throw new TypeError(
      `LocalTime cannot represent an invalid ISO 8601 time-string ${value}. ` +
      `You must provide a valid time-string in one of the following formats: ${SUPPORTED_FORMAT.toString()}.`
    )
  },
  parseLiteral (ast): ?Date {
    if (ast.kind === Kind.STRING) {
      const momentDate = moment(ast.value, SUPPORTED_FORMAT, true)
      if (momentDate.isValid()) {
        return momentDate.toDate()
      }
    }
    return null
  }
})
