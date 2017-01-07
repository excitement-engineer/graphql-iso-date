// @flow

import {
  serializeTime,
  serializeDate,
  serializeDateTime,
  serializeUnixTimestamp,
  parseTime,
  parseDate,
  parseDateTime
} from '../'

import MockDate from 'mockdate'
// Mock the new Date() call so it always returns 2017-01-01T00:00:00.000Z
MockDate.set(new Date(Date.UTC(2017, 0, 1)))

import {stringify} from 'jest-matcher-utils'

describe('formatting', () => {
  [
    [ new Date(Date.UTC(2016, 1, 1)), '00:00:00.000Z' ],
    [ new Date(Date.UTC(2016, 1, 1, 2, 4, 10, 344)), '02:04:10.344Z' ]
  ].forEach(([date, time]) => {
    it(`serializes ${stringify(date)} into time-string ${time}`, () => {
      expect(serializeTime(date)).toEqual(time)
    })
  });

  [
    [ new Date(Date.UTC(2016, 1, 1)), '2016-02-01' ],
    [ new Date(Date.UTC(2016, 1, 1, 4, 5, 5)), '2016-02-01' ],
    [ new Date(2016, 2, 3), '2016-03-03' ]
  ].forEach(([date, dateString]) => {
    it(`serializes ${stringify(date)} into date-string ${dateString}`, () => {
      expect(serializeDate(date)).toEqual(dateString)
    })
  });

  [
    [ new Date(Date.UTC(2016, 1, 1)), '2016-02-01T00:00:00.000Z' ],
    [ new Date(Date.UTC(2016, 3, 5, 10, 1, 4, 555)), '2016-04-05T10:01:04.555Z' ]
  ].forEach(([date, dateTimeString]) => {
    it(`serializes ${stringify(date)} into date-time-string ${dateTimeString}`, () => {
      expect(serializeDateTime(date)).toEqual(dateTimeString)
    })
  });

  [
    [ new Date(Date.UTC(2016, 1, 1)), '2016-02-01T00:00:00.000Z' ],
    [ new Date(Date.UTC(2016, 3, 5, 10, 1, 4, 555)), '2016-04-05T10:01:04.555Z' ]
  ].forEach(([date, dateTimeString]) => {
    it(`serializes ${stringify(date)} into date-time-string ${dateTimeString}`, () => {
      expect(serializeDateTime(date)).toEqual(dateTimeString)
    })
  });

  [
    [ 854325678, '1997-01-27T00:41:18.000Z' ],
    [ 876535, '1970-01-11T03:28:55.000Z' ],
    [ 876535.8, '1970-01-11T03:28:55.800Z' ],
    [ 876535.8321, '1970-01-11T03:28:55.832Z' ],
    [ -876535.8, '1969-12-21T20:31:04.200Z' ],
    [ 0, '1970-01-01T00:00:00.000Z' ],
    // The maximum representable unix timestamp
    [ 2147483647, '2038-01-19T03:14:07.000Z' ],
    // The minimum representable unit timestamp
    [ -2147483648, '1901-12-13T20:45:52.000Z' ]
  ].forEach(([timestamp, dateTimeString]) => {
    it(`serializes Unix timestamp ${stringify(timestamp)} into date-time-string ${dateTimeString}`, () => {
      expect(serializeUnixTimestamp(timestamp)).toEqual(dateTimeString)
    })
  });

  [
    [ '00:00:59Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 59)) ],
    [ '00:00:00.000Z', new Date(Date.UTC(2017, 0, 1)) ],
    [ '00:00:00+01:30', new Date(Date.UTC(2016, 11, 31, 22, 30)) ],
    [ '00:00:00.993Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 993)) ],
    [ '00:00:00.450+01:30', new Date(Date.UTC(2016, 11, 31, 22, 30, 0, 450)) ],
    [ '00:00:00.450-01:30', new Date(Date.UTC(2017, 0, 1, 1, 30, 0, 450)) ]
  ].forEach(([time, date]) => {
    it(`parses time ${stringify(time)} into Date ${stringify(date)}`, () => {
      expect(parseTime(time)).toEqual(date)
    })
  });

  [
    [ '2016-12-17', new Date(Date.UTC(2016, 11, 17)) ],
    [ '2016-02-01', new Date(Date.UTC(2016, 1, 1)) ]
  ].forEach(([dateString, date]) => {
    it(`parses date ${stringify(dateString)} into Date ${stringify(date)}`, () => {
      expect(parseDate(dateString)).toEqual(date)
    })
  });

  [
    // Datetime with hours, minutes and seconds
    [ '2016-02-01T00:00:00Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0)) ],
    [ '2016-02-01T00:00:15Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 15)) ],
    [ '2016-02-01T00:00:59Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 59)) ],
    [ '2016-02-01T00:00:00-11:00', new Date(Date.UTC(2016, 1, 1, 11)) ],
    [ '2017-01-07T11:25:00+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25)) ],
    [ '2017-01-07T00:00:00+01:00', new Date(Date.UTC(2017, 0, 6, 23)) ],
    // Datetime with hours, minutes, seconds and milliseconds
    [ '2016-02-01T00:00:00.000Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0)) ],
    [ '2016-02-01T00:00:00.990Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 990)) ],
    [ '2016-02-01T00:00:00.450Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 450)) ],
    [ '2017-01-07T11:25:00.450+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25, 0, 450)) ]
  ].forEach(([dateTime, date]) => {
    it(`parses date-time ${stringify(dateTime)} into Date ${stringify(date)}`, () => {
      expect(parseDateTime(dateTime)).toEqual(date)
    })
  })
})
