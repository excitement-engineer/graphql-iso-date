# GraphQL ISO Date
[![npm version](https://badge.fury.io/js/graphql-iso-date.svg)](http://badge.fury.io/js/graphql-iso-date)
[![Build Status](https://travis-ci.org/excitement-engineer/graphql-iso-date.svg?branch=master)](https://travis-ci.org/excitement-engineer/graphql-iso-date)

GraphQL ISO Date is an implementation of a set of ISO 8601 compliant [GraphQL](https://facebook.github.io/graphql/) scalar types to be used with [graphQL.js](https://github.com/graphql/graphql-js). All the scalars are based on the [RFC 3339](https://tools.ietf.org/html/rfc3339) ISO 8601 profile.

A basic understanding of GraphQL and of the GraphQL.js implementation is needed to provide context for this library.

This repository contains the following scalars:

- `Date`: A date without a time-zone in the ISO-8601 calendar system, such as 2007-12-03.
- `Time`: A time at UTC in the ISO-8601 calendar system, such as 10:15:30.000Z.
- `DateTime`: A date-time at UTC in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000Z.

## Getting started

Install `graphql-iso-date` using yarn

```sh
yarn add graphql-iso-date
```

Or using npm

```sh
npm install --save graphql-iso-date
```

GraphQL-iso-date exposes 3 different date/time scalars that can be used in combination with [GraphQL.js](https://github.com/graphql/graphql-js). Let's build a simple schema using the scalars included in this library and execute a query:

```js
import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} from 'graphql-iso-date';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      birthdate: {
        type: GraphQLDate,
        resolve: () => new Date(1991, 11, 24);
      },
      openingNYSE: {
        type: GraphQLTime,
        resolve: () => new Date(Date.UTC(2017, 0, 10, 14, 30);
      },
      creationInstant: {
        type: GraphQLDateTime,
        resolve: () => new Date(Date.UTC(2017, 0, 10, 21, 33, 15, 233));
      }
    }
  })
});

const query = `
  {
    birthdate
    openingNYSE
    creationInstant
  }
`;

graphql(schema, query).then(result => {

    // Prints
    // {
    //   data: {
    //     birthdate: '1991-12-24',
    //     openingNYSE: '14:30:00.000Z',
    //     creationInstant: '2017-01-10T21:33:15.233Z'
    //   }
    // }
    console.log(result);
});
```

## Examples

This project includes several examples in the folder `/examples` explaining how to use the various scalars.

Run the examples by downloading this project and running the following commands:

Install dependencies using yarn

```sh
yarn
```

Or npm

```sh
npm install
```

Run the examples

```
npm run examples
```

## Scalars

This section provides a detailed description of each of the scalars.

 > A reference is made to `coercion` in the description below. For further clarification on the meaning of this term, please refer to the GraphQL [spec](http://facebook.github.io/graphql/#sec-Scalars).

### Date

A date without a time-zone in the ISO-8601 calendar system, such as 2007-12-03.

The Date scalar is a representation of a date, viewed as year-month-day.

This scalar does not represent a time or time-zone. Instead, it is a description of the date, as used for birthdays for example. It cannot represent an instant on the time-line.

Date is encoded as a string in the format `YYYY-MM-DD` where `YYYY` indicates a four-digit year, 0000 through 9999. `MM` indicates a two-digit month of the year, 01 through 12. `DD` indicates a two-digit day of that month, 01 through 31.

For example, the value "2nd of January 2015" is encoded as string "2015-01-02".

**Result Coercion**

Javascript Date instances are coerced to the Date scalar. Invalid Dates raise a field error.

**Input Coercion**

When expected as an input type, only valid Date encoded strings are accepted. All other input values raise a query error indicating an incorrect type.


### Time

A time at UTC in the ISO-8601 calendar system, such as 10:15:30.000Z.

Time is a representation of a time instant, viewed as hour-minute-second at UTC. A time instant is represented to millisecond precision. Where an instant does not have millisecond resolution, any missing units are implied to be zero. Where an instant has a time-zone other than UTC, it is shifted to UTC.

Time does not represents a date. Instead, it is a description of a time instant such as the opening bell of the New York Stock Exchange for example. It cannot represent an instant on the time-line. By representing an instant as a date-time at UTC, it allows the local time at which the instant occurs to be derived for each time-zone.

Time is encoded as a string in the format `hh:ss:mm:ss.sssZ` where `hh` indicates a two-digit hour, 00 through 24. `mm` indicates a two-digit minute, 00 through 59. `ss` indicates a two-digit second, 00 through 60 (where 60 is only used to denote an added leap second). `.sss` indicates a fractional second in millisecond precision, .000 through .999. `Z` indicates that the time is at UTC.

The value "14:10:20.987 at UTC" is encoded as string "14:10:20.987Z". A time instant with less than millisecond precision such as "14:10 at UTC" is encoded as "14:10:00.000Z". A time instant with a time-zone other than UTC such as "14:10:20.987 at UTC +1 hour" is encoded as "13:10:20.987Z".

Coercion:

Mention that it coerced into a javascript relative to today. So the string "24:00:00.000Z" is converted to javascript date "2017-01-07T00:00:00.000Z"

### DateTime

A date-time at UTC in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000Z.

DateTime is a representation of a full date with a time at UTC, viewed as a combination of **Date** and **Time**.

DateTime represents an exact instant on the time-line to millisecond precision. It is description of the instant that a user account was created for example. By representing an instant as a date-time at UTC it allows the local date-time at which the instant occurs to be derived for each time-zone.

DateTime is encoded as a concatenation of the string encoding of **Date** and **Time** in the format `<Date>T<Time>`, where `T` represents a delimiter separating the date and time.

For example, the value "2nd December 2009, 14:10.20.987 at UTC" is encoded as string "2009-12-02T14:10.20.987Z".
