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
  validateDateTime,
  validateUnixTimestamp,
  validateJSDate,
  serializeDateTime,
  serializeUnixTimestamp,
  parseDateTime
} from '../utils'

const formats = 'YYYY-MM-DDThh:mm:ssZ, ' +
                'YYYY-MM-DDThh:mm:ss±hh:mm, ' +
                'YYYY-MM-DDThh:mm:ss.sssZ, ' +
                'YYYY-MM-DDThh:mm:ss.sss±hh:mm'

const config: GraphQLScalarTypeConfig<Date, string> = {
  name: 'DateTime',
  description: "A date-time at UTC, such as 2007-12-03T10:15:30.000Z, compliant " +
               "with the RFC 3339 profile of the ISO 8601 standard for representation " +
               "of dates and times using the Gregorian calendar.",
  serialize (value) {
    if (value instanceof Date) {
      if (validateJSDate(value)) {
        return serializeDateTime(value)
      }
      throw new TypeError('DateTime cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      if (validateDateTime(value)) {
        return value
      }
      throw new TypeError(
        `DateTime cannot represent an invalid date-time-string ${value}. You must provide a valid date-time-string in one of the following formats: ${formats}.`
      )
    } else if (typeof value === 'number' || value instanceof Number) {
      if (validateUnixTimestamp(value)) {
        return serializeUnixTimestamp(value)
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
  parseValue (value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `DateTime cannot represent non string type ${JSON.stringify(value)}`
      )
    }

    if (validateDateTime(value)) {
      return parseDateTime(value)
    }
    throw new TypeError(
      `DateTime cannot represent an invalid date-time-string ${value}. You must provide a valid date-time-string in one of the following formats: ${formats}.`
    )
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      if (validateDateTime(ast.value)) {
        return parseDateTime(ast.value)
      }
    }
    return null
  }
}

export default new GraphQLScalarType(config)
