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

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      time: {
        type: GraphQLTime,
        resolve: (): Date => new Date()
      },
      openingNYSE: {
        type: GraphQLTime,
        resolve: (): string => '14:30:00Z'
      },
      timezone: {
        type: GraphQLTime,
        resolve: (): string => '14:30:00+01:00'
      },
      input: {
        type: GraphQLTime,
        args: {
          time: {
            type: GraphQLTime
          }
        },
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
