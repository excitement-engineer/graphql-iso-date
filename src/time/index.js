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
import {
  validateTime,
  validateJSDate,
  serializeTime,
  parseTime
} from '../utils'

const formats = 'hh:mm:ssZ, hh:mm:ss±hh:mm, hh:mm:ss.sssZ, hh:mm:ss.sss±hh:mm'

const config: GraphQLScalarTypeConfig<Date, string> = {
  name: 'Time',
  description: 'A time string at UTC, such as 10:15:30.000Z, compliant with ' +
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
        return value
      }
      throw new TypeError(
        `Time cannot represent an invalid time-string ${value}. ` +
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
      `Time cannot represent an invalid time-string ${value}. ` +
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
