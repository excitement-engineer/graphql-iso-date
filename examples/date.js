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
import { GraphQLDate } from '../dist'

/**
 * Example of the GraphQLDate scalar.
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      today: {
        type: GraphQLDate,
        // Resolve can take a javascript Date
        resolve: (): Date => new Date()
      },
      birthdate: {
        type: GraphQLDate,
        // Resolve can take a date string.
        resolve: (): string => '1991-12-24'
      },
      input: {
        type: GraphQLDate,
        args: {
          date: {
            type: GraphQLDate
          }
        },
        // When passed as argument the date string is parsed to a javascript Date.
        resolve: (_, input: { date: Date }): Date => input.date
      }
    }
  })
})

const query = `
query DateTest($date: Date!) {
  today
  birthdate
  input(date: $date)
}
`

const variables = { date: '2017-10-01' }

graphql(schema, query, null, null, variables).then(data => {
  console.log('\n\nDate Scalar Example:\n')
  console.log(JSON.stringify(data, null, 2))
})
