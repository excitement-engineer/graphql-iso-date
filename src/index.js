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
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'
import moment from 'moment'

// The format of an ISO 8601 date
const format = 'YYYY-MM-DD'

/**
 * The GraphQLDate scalar type that is exported
 */
const graphQLDate = new GraphQLScalarType({
  name: `Date`,
  description: `Represents a date in the format ${format} (ISO 8601). For example, the 1st Feb 2016 is represented as 2016-02-01.`,
  serialize: serialize,
  parseValue: parseValue,
  parseLiteral: parseLiteral
})

export default graphQLDate

/**
 * Parses an ast to a Date object. This is called when an ISO date is inputted
 * in GraphQL and passed as a Date object in the `resolve()` functions.
 * @param ast the ast to be converted to a Date object
 * @returns {Date} the parsed Date object
 */
function parseLiteral (ast):Date {
  if (ast.kind !== Kind.STRING) {
    throw new GraphQLError(`Can only parse strings to a Date but got kind ${ast.kind}`)
  }

  let momentDate = moment(ast.value, format, true)

  if (momentDate.isValid() === false) {
    throw new GraphQLError(`Invalid date ${ast.value}, only accepts dates in format '${format}'`)
  }

  return momentDate.toDate()
}

/**
 * Parses a Date object to a ISO formatted string representation of a Date object. This is called when a
 * Date object is returned in the `resolve()` function and outputted as an ISO date in the GraphQL response.
 * @param {Date} value the date to be serialized
 * @returns {string} the ISO formatted date string
 */
function serialize (value: ?Date): ?string {
  if (value === null) return null

  if (!(value instanceof Date)) {
    throw new TypeError(`Date must be serialized from a ` +
            `javascript Date instance but got object with type '${typeof value}' and value ${String(value)}`)
  } else {
    return moment(value).format(format)
  }
}

/**
 * Parses an ISO formatted date string to a Date object. This is called when an ISO date is inputted
 * in GraphQL and passed as a Date object in the `resolve()` functions.
 * @param {string} value the ISO formatted date string
 * @returns {Date} the parsed Date object
 */
function parseValue (value: ?string): ?Date {
  if (value === null) return null

  if (!(typeof value === 'string' || value instanceof String)) {
    throw new TypeError(`Value must be parsed from a String but got object with type '${typeof value}' and value ${String(value)}`)
  } else {
    let dateMoment = moment(value, format, true)
    if (dateMoment.isValid() === false) {
      throw new Error(`Value ${String(value)} is not a valid date in the format ${format}`)
    }
    return dateMoment.toDate()
  }
}
