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
import { GraphQLTime } from '../dist'

/**
 * Example of the GraphQLTime scalar.
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      time: {
        type: GraphQLTime,
        // Resolve can take a javascript Date.
        resolve: (): Date => new Date()
      },
      openingNYSE: {
        type: GraphQLTime,
        // Resolve can take a time string.
        resolve: (): string => '14:30:00Z'
      },
      timezone: {
        type: GraphQLTime,
        // Resolve takes a time string with a timezone and shifts it to UTC.
        resolve: (): string => '14:30:00+01:00'
      },
      input: {
        type: GraphQLTime,
        args: {
          time: {
            type: GraphQLTime
          }
        },
        // When passed as argument the time string is parsed to a javascript Date.
        resolve: (_, input: { time: Date }): Date => input.time
      }
    }
  })
})

const query = `
query TimeTest($time: Time) {
  time
  openingNYSE
  timezone
  input(time: $time)
}
`

const variables = { time: '11:34:21.345Z' }

graphql(schema, query, null, null, variables).then(data => {
  console.log('\n\nTime Scalar Example:\n')
  console.log(JSON.stringify(data, null, 2))
})
