// @flow
/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {GraphQLScalarType} from 'graphql'
import { Kind } from 'graphql/language'
import moment from 'moment'

const SUPPORTED_FORMATS = [
  'YYYY-MM-DD'
]

const RESULT_FORMAT = 'YYYY-MM-DD'

export default new GraphQLScalarType({
  name: 'LocalDate',
  description: `A date without a time-zone in the ISO-8601 calendar system, such as 2007-12-03.`,
  serialize (value: mixed): string {
    if (value instanceof Date) {
      const time = value.getTime()
      if (time === time) { // eslint-disable-line
        return moment(value).format(RESULT_FORMAT)
      }
      throw new TypeError('Date cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      const momentDate = moment(value, SUPPORTED_FORMATS, true)
      if (momentDate.isValid()) {
        return value
      }
      throw new TypeError(
        `Date cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${SUPPORTED_FORMATS.toString()}.`
      )
    } else {
      throw new TypeError(
        'Date cannot represent a non string, ' +
        'or non Date type ' + JSON.stringify(value)
      )
    }
  },
  parseValue (value: mixed): Date {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `Date cannot represent non string type ${JSON.stringify(value)}`
      )
    }

    // Need to check that it is a string in the correct format
    const momentDate = moment(value, SUPPORTED_FORMATS, true)
    if (momentDate.isValid()) {
      return momentDate.toDate()
    }
    throw new TypeError(
      `Date cannot represent an invalid ISO 8601 date-string ${value}. You must provide a valid date-string in one of the following formats: ${SUPPORTED_FORMATS.toString()}.`
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
