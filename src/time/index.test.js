// @flow

import GraphQLTime from './';
import * as Kind from 'graphql/language/kinds';

const {stringify} = require('jest-matcher-utils');

const createTime = (
  hours:number = 0,
  minutes:number = 0,
  seconds: number = 0,
  milliseconds: number = 0) => {

    const currentDate = new Date()

    return new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getDate(),
      hours,
      minutes,
      seconds,
      milliseconds
    ))
  }

const invalidDates = [
  // General
  'Invalid date',
  // Time with hours
  '25Z',
  '2Z',
  '24',
  '2Z',
  // Time with hours and minutes
  '24:01Z',
  '00:60Z',
  '0:60Z',
  '00:0Z',
  '00:00',
  '0000Z',
  // Time with hours, minutes and seconds
  '000059Z',
  '00:00:60Z',
  '00:00:0Z',
  '00:00:00',
  // Time with hours, minutes, seconds and milliseconds
  '00:00:00.1Z',
  '00:00:00.22Z',
  '00:00:00.1000Z',
  '00:00:00.223'
]

const validDates = [
  // Time with hours
  [ '00Z', createTime() ],
  [ '13Z', createTime(13) ],
  [ '24Z', createTime(24) ],
  // Time with hours and minutes
  [ '00:00Z', createTime() ],
  [ '23:00Z', createTime(23) ],
  [ '23:59Z', createTime(23, 59) ],
  [ '15:32Z', createTime(15, 32) ],
  // Time with hours, minutes and seconds
  [ '00:00:00Z', createTime() ],
  [ '00:00:15Z', createTime(0, 0, 15) ],
  [ '00:00:59Z', createTime(0, 0, 59) ],
  // Time with hours, minutes, seconds and milliseconds
  [ '00:00:00.000Z', createTime() ],
  [ '00:00:00.999Z', createTime(0, 0, 0, 999) ],
  [ '00:00:00.456Z', createTime(0, 0, 0, 456) ],
]

describe('GraphQLTime', () => {

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
          GraphQLTime.serialize(invalidInput)
        ).toThrowErrorMatchingSnapshot()
      })
    });

    // Serialize from Date
    [
      [ new Date(Date.UTC(2016, 0, 1)), '00:00:00.000Z' ],
      [ new Date(Date.UTC(2016, 0, 1, 14, 48, 10, 3)), '14:48:10.003Z' ],
    ].forEach(([ value, expected ]) => {
      it(`serializes javascript Date ${stringify(value)} into ${stringify(expected)}`, () => {
        expect(
          GraphQLTime.serialize(value)
        ).toEqual(expected);
      })
    });

    it(`throws error when serializing invalid date`, () => {
      expect(() =>
        GraphQLTime.serialize(new Date('invalid date'))
      ).toThrowErrorMatchingSnapshot();
    });

    validDates.forEach(([value]) => {
      it(`serializes date-string ${value}`, () => {
        expect(
          GraphQLTime.serialize(value)
        ).toEqual(value);
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error when serializing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLTime.serialize(dateString)
        ).toThrowErrorMatchingSnapshot();
      });
    });

  });

  describe('value parsing', () => {

    validDates.forEach(([ value, expected ]) => {
      it(`parses date-string ${stringify(value)} into javascript Date ${stringify(expected)}`, () => {
        expect(
          GraphQLTime.parseValue(value)
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
          GraphQLTime.parseValue(invalidInput)
        ).toThrowErrorMatchingSnapshot();
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error parsing an invalid time-string ${stringify(dateString)}`, () => {
        expect(() =>
          GraphQLTime.parseValue(dateString)
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
          GraphQLTime.parseLiteral(literal)
        ).toEqual(expected);
      });
    });

    invalidDates.forEach(value => {
      const invalidLiteral = {
        kind: Kind.STRING, value
      };
      it(`returns null when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
        expect(
          GraphQLTime.parseLiteral(invalidLiteral)
        ).toEqual(null);
      });
    });

    const invalidLiteralFloat = {
      kind: Kind.FLOAT, value: 5
    };
    it(`returns null when parsing invalid literal ${stringify(invalidLiteralFloat)}`, () => {
      expect(
        GraphQLTime.parseLiteral(invalidLiteralFloat)
      ).toEqual(null);
    });
  });

});
