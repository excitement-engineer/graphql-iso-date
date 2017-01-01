// @flow

import {GraphQLScalarType} from 'graphql'
import { Kind } from 'graphql/language'
import moment from 'moment'

const SUPPORTED_FORMAT = [
  'HHZ',
  'HH:mmZ',
  'HH:mm:ssZ',
  'HH:mm:ss.SSSZ'
]

export default new GraphQLScalarType({
  name: 'Time',
  description: 'A time at UTC in the ISO-8601 calendar system, such as 10:15:30.000Z',
  serialize (value: mixed): string {
    if (value instanceof Date) {
      const time = value.getTime()
      if (time === time) { // eslint-disable-line
        return moment.utc(value).toISOString().substring(11)
      }
      throw new TypeError('Time cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      const momentDate = moment.utc(value, SUPPORTED_FORMAT, true)
      if (momentDate.isValid()) {
        return value
      }
      throw new TypeError(
        `Time cannot represent an invalid ISO 8601 time-string ${value}. ` +
        `You must provide a valid time-string in one of the following formats: ${SUPPORTED_FORMAT.toString()}.`
      )
    } else {
      throw new TypeError(
        'Time cannot be serialized from a non string, ' +
        'or non Date type ' + JSON.stringify(value)
      )
    }
  },
  parseValue (value: mixed): Date {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `Time cannot represent non string type ${JSON.stringify(value)}`
      )
    }

    // Need to check that it is a string in the correct format
    const momentDate = moment.utc(value, SUPPORTED_FORMAT, true)
    if (momentDate.isValid()) {
      return momentDate.toDate()
    }
    throw new TypeError(
      `Time cannot represent an invalid ISO 8601 time-string ${value}. ` +
      `You must provide a valid time-string in one of the following formats: ${SUPPORTED_FORMAT.toString()}.`
    )
  },
  parseLiteral (ast): ?Date {
    if (ast.kind === Kind.STRING) {
      const momentDate = moment.utc(ast.value, SUPPORTED_FORMAT, true)
      if (momentDate.isValid()) {
        return momentDate.toDate()
      }
    }
    return null
  }
})
