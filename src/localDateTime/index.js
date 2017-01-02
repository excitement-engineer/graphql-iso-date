// @flow

import {GraphQLScalarType} from 'graphql'
import { Kind } from 'graphql/language'
import moment from 'moment'

const SUPPORTED_FORMATS = [
  'YYYY-MM-DDTHH',
  'YYYY-MM-DDTHH:mm',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.SSS'
]

const RESULT_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS'

export default new GraphQLScalarType({
  name: 'LocalDateTime',
  description: 'A date-time without a time-zone in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000.',
  serialize (value: mixed): string {
    if (value instanceof Date) {
      const time = value.getTime()
      if (time === time) { // eslint-disable-line
        return moment(value).format(RESULT_FORMAT)
      }
      throw new TypeError('LocalDateTime cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      const momentDate = moment(value, SUPPORTED_FORMATS, true)
      if (momentDate.isValid()) {
        return value
      }
      throw new TypeError(
        `LocalDateTime cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${SUPPORTED_FORMATS.toString()}.`
      )
    } else {
      throw new TypeError(
        'LocalDateTime cannot represent a non string, ' +
        'or non Date type ' + JSON.stringify(value)
      )
    }
  },
  parseValue (value: mixed): Date {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `LocalDateTime cannot represent non string type ${JSON.stringify(value)}`
      )
    }

    // Need to check that it is a string in the correct format
    const momentDate = moment(value, SUPPORTED_FORMATS, true)
    if (momentDate.isValid()) {
      return momentDate.toDate()
    }
    throw new TypeError(
      `LocalDateTime cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${SUPPORTED_FORMATS.toString()}.`
    )
  },
  parseLiteral (ast): ?Date {
    if (ast.kind === Kind.STRING) {
      const momentDate = moment(ast.value, SUPPORTED_FORMATS, true)
      if (momentDate.isValid()) {
        return momentDate.toDate()
      }
    }
    return null
  }
})
