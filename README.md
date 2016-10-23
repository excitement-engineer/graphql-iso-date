# GraphQL ISO Date
[![npm version](https://badge.fury.io/js/graphql-iso-date.svg)](http://badge.fury.io/js/graphql-iso-date)
[![Build Status](https://travis-ci.org/excitement-engineer/graphql-iso-date.svg?branch=master)](https://travis-ci.org/excitement-engineer/graphql-iso-date)

GraphQL ISO Date is an implementation of a [GraphQL](https://facebook.github.io/graphql/) date scalar type to be used with [graphql.js](https://github.com/graphql/graphql-js). 

This GraphQL scalar type represents a date in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format `YYYY-MM-DD`.

>For example, the 1st Feb 2016 is represented as `2016-02-01` in the ISO format. 

Any date inputted/outputted in GraphQL using the scalar is automatically validated and converted to/from a [Javascript date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). This allows for using javascript dates in your logic rather than having to deal with the string representations of a date.

> For more information on custom scalar types in GraphQL, please refer to the [specification](https://facebook.github.io/graphql/#sec-Scalars).

##Getting started

Install GraphQL ISO Date from npm

```sh
npm install --save graphql-iso-date
```

or from [yarn](https://yarnpkg.com/)

```sh
yarn add graphql-iso-date
```

##Examples

This project includes several examples of the usage of the GraphQL ISO Date in the directory `/examples`.

Run the examples by downloading this project and running the following commands:

Install dependencies using [yarn](https://yarnpkg.com/):

```sh
yarn
```

Run the examples

```
npm run examples
```


### Example 1: Output the current date

Create a simple GraphQL schema with a single query that returns the current date as a javascript date.

```js
import {
    graphql,
    GraphQLObjectType,
    GraphQLSchema,
} from 'graphql';

import GraphQLDate from "graphql-iso-date";

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            today: {
                type: GraphQLDate,
                resolve: function () {
                
                    // Return a Javascript Date object that
                    // is automatically converted to a string
                    // date in format "YYYY-MM-DD".
                    return new Date();
                }
            }
        }
    })
});
```

Running the query will output a string representation of the Javascript Date in the ISO format `YYYY-MM-DD`.

```js
graphql(schema, `{ today }`).then(result => {

    // Prints
    // { 
    //	 data: { today: '2016-07-29' } 
    // }
    console.log(result);
    
})
```


### Example 2: Input a date

This example consists of a schema with a single query `input` that takes a GraphQL ISO Date as input (argument `date`) and subsequently outputs it.

```js
import {
    graphql,
    GraphQLObjectType,
    GraphQLSchema,
} from 'graphql';

import GraphQLDate from "graphql-iso-date";

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
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
                    return date;
                }
            }
        }
    })
});
```

Run the query with ISO date `2016-02-01` as input.

```js
graphql(schema, `{ input(date: "2016-02-01") }`).then(result => {
    
    // Prints
    // { 
    //	data: { input: '2016-02-01' } 
    // }
    console.log(result);
        
})
```

GraphQL ISO Date automatically validates any date that is passed in GraphQL. So passing the nonexistent date `2015-02-29` generates an error.

```js
graphql(schema, `{ input(date: "2015-02-29") }`).then(result => {
    
    // Prints
    // { 
    // 	errors:[ 
    // 		{ message: 'Invalid date 2015-02-29, only accepts dates in format 'YYYY-MM-DD'' } 
    //	] 
    // }
    console.log(result);
        
})
```
