// @flow
/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import GraphQLDateTime from './'
import * as Kind from 'graphql/language/kinds'
import {stringify} from 'jest-matcher-utils'

const invalidDates = [
  // General
  'Invalid date',
  // Datetime with hours
  '2016-02-01T00Z',
  // Datetime with hours and minutes
  '2016-02-01T00:00Z',
  // Datetime with hours, minutes and seconds
  '2016-02-01T000059Z',
  // Datetime with hours, minutes, seconds and fractional seconds
  '2016-02-01T00:00:00.Z',
  // Datetime with hours, minutes, seconds, fractional seconds and timezone.
  '2015-02-24T00:00:00.000+0100'
]

const validDates = [
  // Datetime with hours, minutes and seconds
  [ '2016-02-01T00:00:15Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 15)) ],
  [ '2016-02-01T00:00:00-11:00', new Date(Date.UTC(2016, 1, 1, 11)) ],
  [ '2017-01-07T11:25:00+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25)) ],
  [ '2017-01-07T00:00:00+01:20', new Date(Date.UTC(2017, 0, 6, 22, 40)) ],
  // Datetime with hours, minutes, seconds and fractional seconds
  [ '2016-02-01T00:00:00.1Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 100)) ],
  [ '2016-02-01T00:00:00.000Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0)) ],
  [ '2016-02-01T00:00:00.990Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 990)) ],
  [ '2016-02-01T00:00:00.23498Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 234)) ],
  [ '2017-01-07T11:25:00.450+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25, 0, 450)) ]
]

describe('GraphQLDateTime', () => {
  it('has a description', () => {
    expect(GraphQLDateTime.description).toMatchSnapshot()
  })

  describe('serialization', () => {
    [
      {},
      [],
      null,
      undefined,
      true
    ].forEach(invalidInput => {
      it(`throws error when serializing ${stringify(invalidInput)}`, () => {
        expect(() =>
          GraphQLDateTime.serialize(invalidInput)
        ).toThrowErrorMatchingSnapshot()
      })
    });

    [
      [ new Date(Date.UTC(2016, 0, 1)), '2016-01-01T00:00:00.000Z' ],
      [ new Date(Date.UTC(2016, 0, 1, 14, 48, 10, 30)), '2016-01-01T14:48:10.030Z' ]
    ].forEach(([ value, expected ]) => {
      it(`serializes javascript Date ${stringify(value)} into ${stringify(expected)}`, () => {
        expect(
          GraphQLDateTime.serialize(value)
        ).toEqual(expected)
      })
    })

    it(`throws error when serializing invalid date`, () => {
      expect(() =>
        GraphQLDateTime.serialize(new Date('invalid date'))
      ).toThrowErrorMatchingSnapshot()
    });

    [
      [ '2016-02-01T00:00:15Z', '2016-02-01T00:00:15Z' ],
      [ '2016-02-01T00:00:00.23498Z', '2016-02-01T00:00:00.23498Z' ],
      [ '2016-02-01T00:00:00-11:00', '2016-02-01T11:00:00Z' ],
      [ '2017-01-07T00:00:00.1+01:20', '2017-01-06T22:40:00.1Z' ]
    ].forEach(([input, output]) => {
      it(`serializes date-time-string ${input} into UTC date-time-string ${output}`, () => {
        expect(
          GraphQLDateTime.serialize(input)
        ).toEqual(output)
      })
    })

    invalidDates.forEach(dateString => {
      it(`throws an error when serializing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLDateTime.serialize(dateString)
        ).toThrowErrorMatchingSnapshot()
      })
    });

    // Serializes Unix timestamp
    [
      [ 854325678, '1997-01-27T00:41:18.000Z' ],
      [ 876535, '1970-01-11T03:28:55.000Z' ],
      // The maximum representable unix timestamp
      [ 2147483647, '2038-01-19T03:14:07.000Z' ],
      // The minimum representable unit timestamp
      [ -2147483648, '1901-12-13T20:45:52.000Z' ]
    ].forEach(([ value, expected ]) => {
      it(`serializes unix timestamp ${stringify(value)} into date-string ${expected}`, () => {
        expect(
          GraphQLDateTime.serialize(value)
        ).toEqual(expected)
      })
    });

    [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      // assume Unix timestamp are 32-bit
      2147483648,
      -2147483649
    ].forEach(value => {
      it(`throws an error serializing the invalid unix timestamp ${stringify(value)}`, () => {
        expect(() =>
          GraphQLDateTime.serialize(value)
        ).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('value parsing', () => {
    validDates.forEach(([ value, expected ]) => {
      it(`parses date-string ${stringify(value)} into javascript Date ${stringify(expected)}`, () => {
        expect(
          GraphQLDateTime.parseValue(value)
        ).toEqual(expected)
      })
    });

    [
      null,
      undefined
    ].forEach(invalidInput => {
      it(`parses ${stringify(invalidInput)} into javascript undefined`, () => {
        expect(
          GraphQLDateTime.parseValue(invalidInput)
        ).toBeUndefined()
      })
    });

    [
      4566,
      {},
      [],
      true
    ].forEach(invalidInput => {
      it(`throws an error when parsing ${stringify(invalidInput)}`, () => {
        expect(() =>
          GraphQLDateTime.parseValue(invalidInput)
        ).toThrowErrorMatchingSnapshot()
      })
    })

    invalidDates.forEach(dateString => {
      it(`throws an error parsing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLDateTime.parseValue(dateString)
        ).toThrowErrorMatchingSnapshot()
      })
    })
  })

  describe('literial parsing', () => {
    validDates.forEach(([ value, expected ]) => {
      const literal = {
        kind: Kind.STRING, value
      }

      it(`parses literal ${stringify(literal)} into javascript Date ${stringify(expected)}`, () => {
        expect(
          GraphQLDateTime.parseLiteral(literal)
        ).toEqual(expected)
      })
    })

    invalidDates.forEach(value => {
      const invalidLiteral = {
        kind: Kind.STRING, value
      }
      it(`returns null when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
        expect(
          GraphQLDateTime.parseLiteral(invalidLiteral)
        ).toEqual(null)
      })
    })

    const invalidLiteralFloat = {
      kind: Kind.FLOAT, value: '5'
    }
    it(`returns null when parsing invalid literal ${stringify(invalidLiteralFloat)}`, () => {
      expect(
        GraphQLDateTime.parseLiteral(invalidLiteralFloat)
      ).toEqual(null)
    })
  })
})
