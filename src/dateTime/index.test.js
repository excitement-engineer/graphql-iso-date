// @flow

import GraphQLDateTime from './'
import * as Kind from 'graphql/language/kinds'

const {stringify} = require('jest-matcher-utils')

const invalidDates = [
  // General
  'Invalid date',
  // Datetime with hours
  '2016-02-01T00Z',
  // Datetime with hours and minutes
  '2016-02-01T00:00Z',
  // Datetime with hours, minutes and seconds
  '2016-02-01T000059Z',
  // Datetime with hours, minutes, seconds and milliseconds
  '2016-02-01T00:00:00.1Z',
  // Datetime with hours, minutes, seconds and milliseconds
  '2015-02-24T00:00:00.000+0100'
]

const validDates = [
  // Datetime with hours, minutes and seconds
  [ '2016-02-01T00:00:15Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 15)) ],
  [ '2016-02-01T00:00:59Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 59)) ],
  [ '2016-02-01T00:00:00-11:00', new Date(Date.UTC(2016, 1, 1, 11)) ],
  [ '2017-01-07T11:25:00+01:00', new Date('2017-01-07T10:25') ],
  [ '2017-01-07T00:00:00+01:00', new Date('2017-01-06T23:00') ],
  // Datetime with hours, minutes, seconds and milliseconds
  [ '2016-02-01T00:00:00.000Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0)) ],
  [ '2016-02-01T00:00:00.990Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 990)) ],
  [ '2016-02-01T00:00:00.450Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 450)) ],
  [ '2017-01-07T11:25:00.450+01:00', new Date('2017-01-07T10:25:00.450Z') ]
]

describe('GraphQLDateTime', () => {
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

    // Serialize from Date
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
    })

    validDates.forEach(([value]) => {
      it(`serializes date-string ${value}`, () => {
        expect(
          GraphQLDateTime.serialize(value)
        ).toEqual(value)
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
      undefined,
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
      kind: Kind.FLOAT, value: 5
    }
    it(`returns null when parsing invalid literal ${stringify(invalidLiteralFloat)}`, () => {
      expect(
        GraphQLDateTime.parseLiteral(invalidLiteralFloat)
      ).toEqual(null)
    })
  })
})
