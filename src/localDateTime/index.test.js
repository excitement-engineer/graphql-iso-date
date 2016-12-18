// @flow

import GraphQLLocalDateTime from './';
import * as Kind from 'graphql/language/kinds';
import {stringify} from 'jest-matcher-utils';

const invalidDates = [
  //General
  'invalid date',
  // Datetime with hours
  '2016-02-01T25',
  '2016-02-01T00Z',
  // Datetime with hours and minutes
  '2016-02-01T24:01',
  '2016-02-01T00:60',
  '2016-02-01T0:60',
  '2016-02-01T00:0',
  '2015-02-29T00:00',
  '2016-02-01T0000',
  '2016-01-01T00:00Z',
  // Datetime with hours, minutes and seconds
  '2016-02-01T000059',
  '2016-02-01T00:00:60',
  '2016-02-01T00:00:0',
  '2015-02-29T00:00:00',
  '2016-02-01T00:00:00Z',
  // Datetime with hours, minutes, seconds and milliseconds
  '2016-02-01T00:00:00.1',
  '2016-02-01T00:00:00.22',
  '2015-02-29T00:00:00.000',
  '2016-02-01T00:00:00.223Z',
]

const validDates = [
  // Datetime with hours
  [ '2016-02-01T00', new Date(2016, 1, 1, 0) ],
  [ '2016-02-01T13', new Date(2016, 1, 1, 13) ],
  [ '2016-02-01T24', new Date(2016, 1, 2, 0) ],
  // Datetime with hours and minutes
  [ '2016-12-17T14', new Date(2016, 11, 17, 14) ],
  [ '2016-02-01T23:00', new Date(2016, 1, 1, 23, 0) ],
  [ '2016-02-01T23:59', new Date(2016, 1, 1, 23, 59) ],
  [ '2016-02-01T15:32', new Date(2016, 1, 1, 15, 32) ],
  // Datetime with hours, minutes and seconds
  [ '2016-02-01T00:00:00', new Date(2016, 1, 1, 0, 0, 0) ],
  [ '2016-02-01T00:00:15', new Date(2016, 1, 1, 0, 0, 15) ],
  [ '2016-02-01T00:00:59', new Date(2016, 1, 1, 0, 0, 59) ],
  // Datetime with hours, minutes, seconds and milliseconds
  [ '2016-02-01T00:00:00.000', new Date(2016, 1, 1, 0, 0, 0, 0) ],
  [ '2016-02-01T00:00:00.999', new Date(2016, 1, 1, 0, 0, 0, 999) ],
  [ '2016-02-01T00:00:00.456', new Date(2016, 1, 1, 0, 0, 0, 456) ],
]

describe('GraphQLLocalDateTime', () => {

  describe('serialization', () => {
    [
      {},
      [],
      null,
      undefined,
      true,
    ].forEach(invalidInput => {
      it(`throws error when serializing ${stringify(invalidInput)}`, () => {
        expect(() =>
          GraphQLLocalDateTime.serialize(invalidInput)
        ).toThrowErrorMatchingSnapshot()
      })
    });

    [
      [ new Date(2016, 11, 17, 14), '2016-12-17T14:00:00.000' ],
      [ new Date(2016, 0, 1, 14, 48, 10, 3), '2016-01-01T14:48:10.003' ],
    ].forEach(([ value, expected ]) => {
      it(`serializes javascript Date ${stringify(value)} into ${stringify(expected)}`, () => {
        expect(
          GraphQLLocalDateTime.serialize(value)
        ).toEqual(expected);
      })
    });

    it(`throws error when serializing invalid date`, () => {
      expect(() =>
        GraphQLLocalDateTime.serialize(new Date('invalid date'))
      ).toThrowErrorMatchingSnapshot();
    });

    validDates.forEach(([value]) => {
      it(`serializes date-string ${value}`, () => {
        expect(
          GraphQLLocalDateTime.serialize(value)
        ).toEqual(value);
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error when serializing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLLocalDateTime.serialize(dateString)
        ).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('value parsing', () => {

    validDates.forEach(([ value, expected ]) => {
      it(`parses date-string ${stringify(value)} into javascript Date ${stringify(expected)}`, () => {
        expect(
          GraphQLLocalDateTime.parseValue(value)
        ).toEqual(expected);
      })
    });

    [
      null,
      undefined,
      4566,
      {},
      [],
      true,
    ].forEach(invalidInput => {
      it(`throws an error when parsing ${stringify(invalidInput)}`, () => {
        expect(() =>
          GraphQLLocalDateTime.parseValue(invalidInput)
        ).toThrowErrorMatchingSnapshot();
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error parsing an invalid datetime-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLLocalDateTime.parseValue(dateString)
        ).toThrowErrorMatchingSnapshot();
      })
    });
  });

  describe('literial parsing', () => {

    validDates.forEach(([ value, expected ]) => {
      const literal = {
        kind: Kind.STRING, value
      };

      it(`parses literal ${stringify(literal)} into javascript Date ${stringify(expected)}`, () => {
        expect(
          GraphQLLocalDateTime.parseLiteral(literal).toISOString()
        ).toEqual(expected.toISOString());
      });
    });

    invalidDates.forEach(value => {
      const invalidLiteral = {
        kind: Kind.STRING, value
      };
      it(`returns null when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
        expect(
          GraphQLLocalDateTime.parseLiteral(invalidLiteral)
        ).toEqual(null);
      });
    });

    const invalidLiteralFloat = {
      kind: Kind.FLOAT, value: 5
    };
    it(`returns null when parsing invalid literal ${stringify(invalidLiteralFloat)}`, () => {
      expect(
        GraphQLLocalDateTime.parseLiteral(invalidLiteralFloat)
      ).toEqual(null);
    });
  });
});
