// @flow
/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'
import { GraphQLDateTime } from '../dist'

/**
 * Example of the GraphQLDateTime scalar.
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      now: {
        type: GraphQLDateTime,
        // Resolve can take a javascript Date.
        resolve: (): Date => new Date()
      },
      instant: {
        type: GraphQLDateTime,
        // Resolve can take a date-time string.
        resolve: (): string => '2017-01-27T21:46:33.6756Z'
      },
      timezone: {
        type: GraphQLDateTime,
        // Resolve takes a date-time string with a timezone and shifts it to UTC.
        resolve: (): string => '2017-01-07T00:00:00.1+01:20'
      },
      unix: {
        type: GraphQLDateTime,
        // Resolve can take a timestamp.
        resolve: (): number => 344555632.543
      },
      input: {
        type: GraphQLDateTime,
        args: {
          dateTime: {
            type: GraphQLDateTime
          }
        },
        // When passed as argument the date-time string is parsed to a javascript Date.
        resolve: (_, input: { dateTime: Date }): Date => input.dateTime
      }
    }
  })
})

const query = `
query DateTimeTest($dateTime: DateTime) {
  now
  unix
  instant
  timezone
  input(dateTime: $dateTime)
}
`

const variables = { dateTime: '2010-01-11T11:34:21Z' }

graphql(schema, query, null, null, variables).then(data => {
  console.log('\n\nDateTime Scalar Example:\n')
  console.log(JSON.stringify(data, null, 2))
})
