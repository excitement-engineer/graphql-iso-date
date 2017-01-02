// @flow

import {GraphQLScalarType} from 'graphql'
import { Kind } from 'graphql/language'
import moment from 'moment'

const MAX_INT = 2147483647
const MIN_INT = -2147483648

const SUPPORTED_FORMAT = [
  'YYYY-MM-DDTHHZ',
  'YYYY-MM-DDTHH:mmZ',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZ'
]

export default new GraphQLScalarType({
  name: 'DateTime',
  description: 'A date-time at UTC in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000Z.',
  serialize (value: mixed): string {
    if (value instanceof Date) {
      const time = value.getTime()
      if (time === time) { // eslint-disable-line
        return moment.utc(value).toISOString()
      }
      throw new TypeError('DateTime cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      const momentDate = moment.utc(value, SUPPORTED_FORMAT, true)
      if (momentDate.isValid()) {
        return value
      }
      throw new TypeError(
        `DateTime cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${SUPPORTED_FORMAT.toString()}.`
      )
    } else if (typeof value === 'number' || value instanceof Number) {
      // Serialize from Unix timestamp: the number of
      // seconds since 1st Jan 1970.

      // Unix timestamp are 32-bit signed integers
      if (value === value && value <= MAX_INT && value >= MIN_INT) { // eslint-disable-line
        const date = moment.unix(value)
        return date.toISOString()
      }
      throw new TypeError(
        'DateTime cannot represent an invalid Unix timestamp ' + value
      )
    } else {
      throw new TypeError(
        'DateTime cannot be serialized from a non string, ' +
        'non numeric or non Date type ' + JSON.stringify(value)
      )
    }
  },
  parseValue (value: mixed): Date {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `DateTime cannot represent non string type ${JSON.stringify(value)}`
      )
    }

    // Need to check that it is a string in the correct format
    const momentDate = moment.utc(value, SUPPORTED_FORMAT, true)
    if (momentDate.isValid()) {
      return momentDate.toDate()
    }
    throw new TypeError(
      `DateTime cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${SUPPORTED_FORMAT.toString()}.`
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
