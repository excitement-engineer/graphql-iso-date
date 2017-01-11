# GraphQL ISO Date

TODOS:

- Should we mention that it is a date/time string in the description.
- Mention that we ignore leap seconds because Javascript Dates also do not take these into account and these cannot be known beforehand. Add this to the section "Leap Second Issues"

[![npm version](https://badge.fury.io/js/graphql-iso-date.svg)](http://badge.fury.io/js/graphql-iso-date)
[![Build Status](https://travis-ci.org/excitement-engineer/graphql-iso-date.svg?branch=master)](https://travis-ci.org/excitement-engineer/graphql-iso-date)

GraphQL ISO Date is a set of [RFC 3339](./rfc3339.txt) compliant date and time scalar types to be used with [graphQL.js](https://github.com/graphql/graphql-js).

> RFC 3339 *"defines a date and time format for use in Internet
protocols that is a profile of the ISO 8601 standard for
representation of dates and times using the Gregorian calendar."*

> **Date and Time on the Internet: Timestamps, July 2002.**

A basic understanding of [GraphQL](http://facebook.github.io/graphql/) and of the [graphQL.js](https://github.com/graphql/graphql-js) implementation is needed to provide context for this library.

This repository contains the following scalars:

- `Date`: A date without a time-zone, such as 2007-12-03, compliant with the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
- `Time`: A time at UTC, such as 10:15:30.000Z, compliant with the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
- `DateTime`: A date-time at UTC, such as 2007-12-03T10:15:30.000Z, compliant with the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.

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

A date string without a time-zone, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.

The Date scalar is a representation of a date, viewed as year-month-day.

This scalar does not represent a time or time-zone. Instead, it is a description of the date, as used for birthdays for example. It cannot represent an instant on the time-line.

The value "2nd of January 2015" is encoded as string "2015-01-02".

**Result Coercion**

Javascript Date instances are coerced to the Date scalar. Invalid Dates raise a field error.

**Input Coercion**

When expected as an input type, only valid Date encoded strings are accepted. All other input values raise a query error indicating an incorrect type.

### Time

A time string at UTC, such as 10:15:30.000Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.

Time is a representation of a time instant, viewed as hour-minute-second at UTC. A time instant is represented to millisecond precision. Where the seconds in a time instant do not have millisecond resolution, it is implied to be zero milliseconds. Where a time instant has a time-zone other than UTC, it is shifted to UTC. The Time scalar ignores leap seconds (thereby assuming that a minute constitutes of 59 seconds), in this respect it diverges from the RFC 3339 profile.

Time does not represents a date. Instead, it is a description of a time instant such as the opening bell of the New York Stock Exchange for example. It cannot represent an exact instant on the time-line.

The value "14:10:20.987 at UTC" is encoded as string "14:10:20.987Z". A time instant without a millisecond resolution such as "14:10:20 at UTC" is encoded as "14:10:20.000Z". A time instant with a time-zone other than UTC such as "14:10:20.987 at UTC +1 hour" is shifted to UTC: "13:10:20.987Z".

**Result Coercion**

Javascript Date instances are coerced to the Date scalar by extracting the time part and shifting this to UTC accordingly. Invalid Dates raise a field error.

**Input Coercion**

Mention that it coerced into a javascript relative to today. So the string "24:00:00.000Z" is converted to javascript date "2017-01-07T00:00:00.000Z"

### DateTime

A date-time at UTC in the ISO-8601 calendar system, such as 2007-12-03T10:15:30.000Z.

DateTime is a representation of a full date with a time at UTC, viewed as a combination of **Date** and **Time**.

DateTime represents an exact instant on the time-line to millisecond precision. It is description of the instant that a user account was created for example. By representing an instant as a date-time at UTC it allows the local date-time at which the instant occurs to be derived for each time-zone.

DateTime is encoded as a concatenation of the string encoding of **Date** and **Time** in the format `<Date>T<Time>`, where `T` represents a delimiter separating the date and time.

For example, the value "2nd December 2009, 14:10.20.987 at UTC" is encoded as string "2009-12-02T14:10.20.987Z".
