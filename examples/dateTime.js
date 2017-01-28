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

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      now: {
        type: GraphQLDateTime,
        resolve: (): Date => new Date()
      },
      instant: {
        type: GraphQLDateTime,
        resolve: (): string => '2017-01-27T21:46:33.6756Z'
      },
      unix: {
        type: GraphQLDateTime,
        resolve: (): number => 344555632.543
      },
      input: {
        type: GraphQLDateTime,
        args: {
          dateTime: {
            type: GraphQLDateTime
          }
        },
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
  input(dateTime: $dateTime)
}
`

const variables = { dateTime: '2010-01-11T11:34:21Z' }

graphql(schema, query, null, null, variables).then(data => {
  console.log('\n\nDateTime Scalar Example:\n')
  console.log(JSON.stringify(data, null, 2))
})
