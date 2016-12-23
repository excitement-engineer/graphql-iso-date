# GraphQL ISO Date
[![npm version](https://badge.fury.io/js/graphql-iso-date.svg)](http://badge.fury.io/js/graphql-iso-date)
[![Build Status](https://travis-ci.org/excitement-engineer/graphql-iso-date.svg?branch=master)](https://travis-ci.org/excitement-engineer/graphql-iso-date)

GraphQL ISO Date is an implementation of a set of ISO 8601 compliant [GraphQL](https://facebook.github.io/graphql/) date scalar type to be used with [graphql.js](https://github.com/graphql/graphql-js).

This repository contains the following scalars:

- `LocalDate`: A date without a time-zone in the ISO-8601 calendar system, such as 2007-12-03.
- `LocalTime`: A time without a time-zone in the ISO-8601 calendar system, such as 10:15:30.000.
- `Time`: A time at UTC in the ISO-8601 calendar system, such as 10:15:30.000Z.
- `LocalDateTime`: A date-time without a time-zone in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000.
- `DateTime`: A date-time at UTC in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000Z.

## LocalDate

A date without a time-zone in the ISO-8601 calendar system, such as 2007-12-03.

LocalDate is a representation of a date, viewed as year-month-day.

This scalar does not represent a time or time-zone. Instead, it is a description of the date, as used for birthdays for example. It cannot represent an instant on the time-line.

LocalDate is encoded as a string in the format `YYYY-MM-DD` where `YYYY` indicates a four-digit year, 0000 through 9999. `MM` indicates a two-digit month of the year, 01 through 12. `DD` indicates a two-digit day of that month, 01 through 31.

For example, the value "2nd of January 2015" is encoded as string "2015-01-02".

## LocalTime

A time without a time-zone in the ISO-8601 calendar system, such as 10:15:30.000.

LocalTime is a representation of a time, viewed as hour-minute-second. Time is represented to millisecond precision. Where a time does not have millisecond resolution, any missing units are implied to be zero.

This scalar does not represent a date or time-zone. Instead, it is a description of the local time as seen on a wall clock for example. It cannot represent an instant on the time-line.

LocalTime is encoded as a string in the format `hh:ss:mm:ss.sss` where `hh` indicates a two-digit hour, 00 through 24. `mm` indicates a two-digit minute, 00 through 59. `ss` indicates a two-digit second, 00 through 60 (where 60 is only used to denote an added leap second). `.sss` indicates a fractional second in millisecond precision, .000 through .999.

The value "14:10:20.987" is encoded as string "14:10:20.987". A time with less than millisecond precision such as "14:10" is encoded as "14:10:00.000".

## Time

A time at UTC in the ISO-8601 calendar system, such as 10:15:30.000Z.

Time is a representation of a time instant, viewed as hour-minute-second at UTC. A time instant is represented to millisecond precision. Where an instant does not have millisecond resolution, any missing units are implied to be zero. Where an instant has a time-zone other than UTC, it is shifted to UTC.

Time does not represents a date. Instead, it is a description of a time instant such as the opening bell of the New York Stock Exchange for example. It cannot represent an instant on the time-line. By representing an instant as a date-time at UTC, it allows the local time at which the instant occurs to be derived for each time-zone.

Time is encoded as a string in the format `hh:ss:mm:ss.sssZ` where `hh` indicates a two-digit hour, 00 through 24. `mm` indicates a two-digit minute, 00 through 59. `ss` indicates a two-digit second, 00 through 60 (where 60 is only used to denote an added leap second). `.sss` indicates a fractional second in millisecond precision, .000 through .999. `Z` indicates that the time is at UTC.

The value "14:10:20.987 at UTC" is encoded as string "14:10:20.987Z". A time instant with less than millisecond precision such as "14:10 at UTC" is encoded as "14:10:00.000Z". A time instant with a time-zone other than UTC such as "14:10:20.987 at UTC +1 hour" is encoded as "13:10:20.987Z".

## LocalDateTime

A date-time without a time-zone in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000.

LocalDateTime is a representation of a full date with a local time, viewed as a combination of **LocalDate** and **LocalTime**.

This scalar does not represent a time-zone. Instead, it is a description of the date, as used for birthdays for example, combined with the local time as seen on a wall clock. It cannot represent an instant on the time-line.

LocalDateTime is encoded encoded as a concatenation of the string encoding of **LocalDate** and **LocalTime** in the format `<LocalDate>T<LocalTime>`, where `T` represents a delimiter separating the date and time.

For example, the value "2nd December 2009 at 14:10.20.987" is encoded as string "2009-12-02T14:10.20.987".

## DateTime

A date-time at UTC in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000Z.

DateTime is a representation of a full date with a time at UTC, viewed as a combination of **LocalDate** and **Time**.

DateTime represents an exact instant on the time-line to millisecond precision. It is description of the instant that a user account was created for example. By representing an instant as a date-time at UTC it allows the local date-time at which the instant occurs to be derived for each time-zone.

DateTime is encoded as a concatenation of the string encoding of **LocalDate** and **Time** in the format `<LocalDate>T<Time>`, where `T` represents a delimiter separating the date and time.

For example, the value "2nd December 2009, 14:10.20.987 at UTC" is encoded as string "2009-12-02T14:10.20.987Z".

## Getting started

Install GraphQL ISO Date from npm

```sh
npm install --save graphql-iso-date
```

or from [yarn](https://yarnpkg.com/)

```sh
yarn add graphql-iso-date
```

## Examples

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
