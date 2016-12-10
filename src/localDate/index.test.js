/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var Kind = require('graphql/language').Kind

import GraphQLDate from './'

describe('GraphQLDate', () => {
  describe('serialization test', () => {
    it('serializes javascript dates', () => {
      expect(GraphQLDate.serialize(new Date(2012, 10, 10))).toEqual('2012-11-10')
      expect(GraphQLDate.serialize(null)).toEqual(null)
      expect(() => GraphQLDate.serialize(5)).toThrowErrorMatchingSnapshot()
      expect(() => GraphQLDate.serialize('2010-11-10')).toThrowErrorMatchingSnapshot()
    })
  })

  describe('value parsing test', () => {
    it('parses values', () => {
      expect(GraphQLDate.parseValue('2012-11-10').getTime()).toEqual(new Date(2012, 10, 10).getTime())
      expect(GraphQLDate.parseValue(null)).toEqual(null)
      expect(() => GraphQLDate.parseValue(5)).toThrowErrorMatchingSnapshot()
      expect(() => GraphQLDate.parseValue('2011-02-29')).toThrowErrorMatchingSnapshot()
      expect(() => GraphQLDate.parseValue('2011/02/29')).toThrowErrorMatchingSnapshot()
      expect(() => GraphQLDate.parseValue('bla')).toThrowErrorMatchingSnapshot()
    })
  })

  describe('literal parsing test', () => {
    it('parses literals', () => {
      expect(
        GraphQLDate.parseLiteral({kind: Kind.STRING, value: '2012-11-10'}).getTime()
      ).toEqual(new Date(2012, 10, 10).getTime())
      expect(() => {
        GraphQLDate.parseLiteral({kind: Kind.STRING, value: '2011-02-29'})
      }).toThrowErrorMatchingSnapshot()
      expect(() => {
        GraphQLDate.parseLiteral({kind: Kind.STRING, value: 'bla'})
      }).toThrowErrorMatchingSnapshot()
      expect(() => {
        GraphQLDate.parseLiteral({kind: Kind.INT, value: 5})
      }).toThrowErrorMatchingSnapshot()
    })
  })
})
