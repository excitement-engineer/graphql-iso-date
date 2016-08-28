/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * An example consisting of a schema with a single query `input` that takes a GraphQL ISO Date as input (argument `date`) and subsequently outputs it.
 *
 * Two queries are run against this schema:
 *
 * - A query where a valid date is passed in the argument `date`.
 * - A query where an invalid date is passed in the argument `date`.
 */

import {
    graphql,
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql'

import GraphQLDate from '../dist'

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      input: {
        type: GraphQLDate,
        args: {
          date: {
            type: GraphQLDate
          }
        },
        resolve: function (_, {date}) {
                    // The date parameter is a Javascript Date object
          return date
        }
      }
    }
  })
})

graphql(schema, `{ input(date: "2016-02-01") }`)
    .then(result => {
      console.log(`Example query { input(date: "2016-02-01") }: Input a valid date and output the same date`)
      console.log(result)
    })
    .catch(console.error)

graphql(schema, `{ input(date: "2015-02-29") }`)
    .then(result => {
      console.log(`Example query { input(date: "2015-02-29") }: Output an error when an invalid date is passed as input (29 Feb 2015 doesn't exist)`)
      console.log(result)
    })
    .catch(console.error)
