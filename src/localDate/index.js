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
  validateDate,
  validateJSDate,
  serializeDate,
  parseDate
} from '../utils'

const formats = 'YYYY-MM-DD'

const config: GraphQLScalarTypeConfig<Date, string> = {
  name: 'Date',
  description: `A date without a time-zone in the ISO-8601 calendar system, such as 2007-12-03.`,
  serialize (value) {
    if (value instanceof Date) {
      if (validateJSDate(value)) {
        return serializeDate(value)
      }
      throw new TypeError('Date cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      if (validateDate(value)) {
        return value
      }
      throw new TypeError(
        `Date cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${formats}.`
      )
    } else {
      throw new TypeError(
        'Date cannot represent a non string, ' +
        'or non Date type ' + JSON.stringify(value)
      )
    }
  },
  parseValue (value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `Date cannot represent non string type ${JSON.stringify(value)}`
      )
    }

    if (validateDate(value)) {
      return parseDate(value)
    }
    throw new TypeError(
      `Date cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${formats}.`
    )
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      if (validateDate(ast.value)) {
        return parseDate(ast.value)
      }
    }
    return null
  }
}

export default new GraphQLScalarType(config)
