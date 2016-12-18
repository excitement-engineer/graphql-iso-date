/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * An example of a simple GraphQL schema with a single query that returns the current date as a GraphQL ISO Date.
 */

import {
    graphql,
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql'

import {GraphQLLocalDate} from '../../dist'

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      today: {
        type: GraphQLLocalDate,
        resolve: function () {
          // Return a Javascript Date that
          // is automatically converted to a string
          // date in format "YYYY-MM-DD".
          return new Date()
        }
      }
    }
  })
})

graphql(schema, `{ today }`)
    .then(result => {
      console.log("Example query { today }: Query today's date")
      console.log(result)
    })
    .catch(console.error)
