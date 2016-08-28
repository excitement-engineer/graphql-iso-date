/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * This file includes all the modules that are imported by mocha before running the tests.
 */

/**
 * Required for compiling Mocha test code using babel
 */
require('babel-register')

/**
 * Required for using async/await function
 */
require('babel-polyfill')
