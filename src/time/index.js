// @flow
/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {GraphQLScalarType} from 'graphql'
import type {GraphQLScalarTypeConfig} from 'graphql' // eslint-disable-line
import { Kind } from 'graphql/language'
import { GraphQLError } from 'graphql/error'
import {
  validateTime,
  validateJSDate,
  serializeTime,
  serializeTimeString,
  parseTime,
  createParseHandler
} from '../utils'


const SCALAR_NAME = 'Time';
const handleParse = createParseHandler(SCALAR_NAME, validateTime, parseTime)

/**
 * An RFC 3339 compliant time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 time string as input and
 *    parses it to a javascript Date (with a year-month-day relative
 *    to the current day).
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 time strings to RFC 3339 UTC time strings.
 */
const config: GraphQLScalarTypeConfig<Date, string> = {
  name: SCALAR_NAME,
  description: 'A time string at UTC, such as 10:15:30Z, compliant with ' +
               'the `full-time` format outlined in section 5.6 of the RFC 3339' +
               'profile of the ISO 8601 standard for representation of dates and ' +
               'times using the Gregorian calendar.',
  serialize (value: mixed): string {
    if (value instanceof Date) {
      if (validateJSDate(value)) {
        return serializeTime(value)
      }
      throw new TypeError('Time cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      if (validateTime(value)) {
        return serializeTimeString(value)
      }
      throw new TypeError(
        `Time cannot represent an invalid time-string ${value}.`
      )
    } else {
      throw new TypeError(
        'Time cannot be serialized from a non string, ' +
        'or non Date type ' + JSON.stringify(value)
      )
    }
  },
  parseValue (value) {
    return handleParse(value)
  },
  parseLiteral (ast) {
    return handleParse(ast.kind === Kind.STRING ? ast.value : null, ast)
  }
}

export default new GraphQLScalarType(config)
