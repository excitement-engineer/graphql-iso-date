// @flow

import {GraphQLScalarType} from 'graphql'
import type {GraphQLScalarTypeConfig} from 'graphql' // eslint-disable-line
import { Kind } from 'graphql/language'
import {
  validateTime,
  validateJSDate,
  serializeTime,
  parseTime
} from '../utils'

const formats = 'hh:mm:ssZ, hh:mm:ss±hh:mm, hh:mm:ss.SSZ, hh:mm:ss.SS±hh:mm'

const config: GraphQLScalarTypeConfig<Date, string> = {
  name: 'Time',
  description: 'A time at UTC in the ISO-8601 calendar system, such as 10:15:30.00Z',
  serialize (value: mixed): string {
    if (value instanceof Date) {
      if (validateJSDate(value)) {
        return serializeTime(value)
      }
      throw new TypeError('Time cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      if (validateTime(value)) {
        return value
      }
      throw new TypeError(
        `Time cannot represent an invalid ISO 8601 time-string ${value}. ` +
        `You must provide a valid time-string in one of the following formats: ${formats}.`
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

    if (validateTime(value)) {
      return parseTime(value)
    }
    throw new TypeError(
      `Time cannot represent an invalid ISO 8601 time-string ${value}. ` +
      `You must provide a valid time-string in one of the following formats: ${formats}.`
    )
  },
  parseLiteral (ast): ?Date {
    if (ast.kind === Kind.STRING) {
      if (validateTime(ast.value)) {
        return parseTime(ast.value)
      }
    }
    return null
  }
}

export default new GraphQLScalarType(config)
