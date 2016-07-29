/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
    graphql,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt
} from 'graphql';

var Kind = require('graphql/language').Kind;

import { expect } from 'chai';
import  GraphQLDate  from "../";

describe("GraphQLDate", () => {

    describe("serialization test", () => {

        it("serializes javascript dates", () => {

            let date = new Date(2012, 10, 10);

            expect(
                GraphQLDate.serialize(date)
            ).to.equal("2012-11-10");


            expect(
                GraphQLDate.serialize(null)
            ).to.equal(null);

            expect(()=>
                GraphQLDate.serialize(5)
            ).to.throw(
                `Date must be serialized from a ` +
                `javascript Date instance but got ` +
                `object with type 'number' and value 5`
            );

            expect(() =>
                GraphQLDate.serialize("2010-11-10")
            ).to.throw(
                `Date must be serialized from a ` +
                `javascript Date instance but got ` +
                `object with type 'string' and value 2010-11-10`
            )

        });
    });

    describe("value parsing test", () => {

        it("parses values", () => {

            //We can only do value equality with getTime() function of Date
            let expectedDate = new Date(2012, 10, 10).getTime();

            expect(
                GraphQLDate.parseValue("2012-11-10").getTime()
            ).to.equal(expectedDate);

            expect(
                GraphQLDate.parseValue(null)
            ).to.equal(null);

            expect(() => {
                GraphQLDate.parseValue(5)
            }).to.throw(`Value must be parsed from a String but got object with type 'number' and value 5`);

            expect(()=> {
                GraphQLDate.parseValue("2011-02-29")
            }).to.throw(`Value 2011-02-29 is not a valid date in the format YYYY-MM-DD`);

            expect(()=> {
                GraphQLDate.parseValue("2011/02/29")
            }).to.throw(`Value 2011/02/29 is not a valid date in the format YYYY-MM-DD`);

            expect(()=> {
                GraphQLDate.parseValue("bla")
            }).to.throw(`Value bla is not a valid date in the format YYYY-MM-DD`);


        });
    });

    describe("literal parsing test", () => {

        it("parses literals", () => {

            //We can only do value equality with getTime() function of Date
            let expectedDate = new Date(2012, 10, 10).getTime();

            let ast = {
                kind: Kind.STRING,
                value: "2012-11-10"
            };

            expect(
                GraphQLDate.parseLiteral(ast).getTime()
            ).to.equal(expectedDate);

            expect(() => {
                GraphQLDate.parseLiteral({kind: Kind.STRING, value: "2011-02-29"})
            }).to.throw(`Invalid date 2011-02-29, only accepts dates in format 'YYYY-MM-DD'`);

            expect(() => {
                GraphQLDate.parseLiteral({kind: Kind.STRING, value: "bla"})
            }).to.throw(`Invalid date bla, only accepts dates in format 'YYYY-MM-DD'`);

            expect(() => {
                GraphQLDate.parseLiteral({kind: Kind.INT, value: 5})
            }).to.throw(`Can only parse strings to a Date but got kind IntValue`);

        });
    });
});