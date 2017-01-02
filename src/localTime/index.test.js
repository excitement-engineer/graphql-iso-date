// @flow

import GraphQLLocalTime from './';
import * as Kind from 'graphql/language/kinds';

const {stringify} = require('jest-matcher-utils');

const createTime = (
  hours:number = 0,
  minutes:number = 0,
  seconds: number = 0,
  milliseconds: number = 0) => {

    const currentDate = new Date()

    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes,
      seconds,
      milliseconds
    )
  }

const invalidDates = [
  // General
  'Invalid date',
  // LocalTime with hours
  '25',
  '2Z',
  '24Z',
  // LocalTime with hours and minutes
  '24:01',
  '00:60',
  '0:60',
  '00:0',
  '00:00Z',
  '0000',
  // LocalTime with hours, minutes and seconds
  '000059',
  '00:00:60',
  '00:00:0',
  '00:00:00Z',
  // LocalTime with hours, minutes, seconds and milliseconds
  '00:00:00.1',
  '00:00:00.22',
  '00:00:00.1000',
  '00:00:00.223Z'
]

const validDates = [
  // LocalTime with hours
  [ '00', createTime() ],
  [ '13', createTime(13) ],
  [ '24', createTime(24) ],
  // LocalTime with hours and minutes
  [ '00:00', createTime() ],
  [ '23:00', createTime(23) ],
  [ '23:59', createTime(23, 59) ],
  [ '15:32', createTime(15, 32) ],
  // LocalTime with hours, minutes and seconds
  [ '00:00:00', createTime() ],
  [ '00:00:15', createTime(0, 0, 15) ],
  [ '00:00:59', createTime(0, 0, 59) ],
  // LocalTime with hours, minutes, seconds and milliseconds
  [ '00:00:00.000', createTime() ],
  [ '00:00:00.999', createTime(0, 0, 0, 999) ],
  [ '00:00:00.456', createTime(0, 0, 0, 456) ],
  [ '15:31:14.325', createTime(15, 31, 14, 325) ]
]

describe('GraphQLLocalTime', () => {

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
          GraphQLLocalTime.serialize(invalidInput)
        ).toThrowErrorMatchingSnapshot()
      })
    });

    // Serialize from Date
    [
      [ new Date(2016, 0, 1), '00:00:00.000' ],
      [ new Date(2016, 0, 1, 14, 48, 10, 3), '14:48:10.003' ],
    ].forEach(([ value, expected ]) => {
      it(`serializes javascript Date ${stringify(value)} into ${stringify(expected)}`, () => {
        expect(
          GraphQLLocalTime.serialize(value)
        ).toEqual(expected);
      })
    });

    it(`throws error when serializing invalid date`, () => {
      expect(() =>
        GraphQLLocalTime.serialize(new Date('invalid date'))
      ).toThrowErrorMatchingSnapshot();
    });

    validDates.forEach(([value]) => {
      it(`serializes date-string ${value}`, () => {
        expect(
          GraphQLLocalTime.serialize(value)
        ).toEqual(value);
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error when serializing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLLocalTime.serialize(dateString)
        ).toThrowErrorMatchingSnapshot();
      });
    });

  });

  describe('value parsing', () => {

    validDates.forEach(([ value, expected ]) => {
      it(`parses date-string ${stringify(value)} into javascript Date ${stringify(expected)}`, () => {
        expect(
          GraphQLLocalTime.parseValue(value)
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
          GraphQLLocalTime.parseValue(invalidInput)
        ).toThrowErrorMatchingSnapshot();
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error parsing an invalid time-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLLocalTime.parseValue(dateString)
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
          GraphQLLocalTime.parseLiteral(literal)
        ).toEqual(expected);
      });
    });

    invalidDates.forEach(value => {
      const invalidLiteral = {
        kind: Kind.STRING, value
      };
      it(`returns null when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
        expect(
          GraphQLLocalTime.parseLiteral(invalidLiteral)
        ).toEqual(null);
      });
    });

    const invalidLiteralFloat = {
      kind: Kind.FLOAT, value: 5
    };
    it(`returns null when parsing invalid literal ${stringify(invalidLiteralFloat)}`, () => {
      expect(
        GraphQLLocalTime.parseLiteral(invalidLiteralFloat)
      ).toEqual(null);
    });
  });

});
