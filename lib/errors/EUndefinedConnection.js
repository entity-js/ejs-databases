/**
 *  ______   __   __   ______  __   ______  __  __
 * /\  ___\ /\ "-.\ \ /\__  _\/\ \ /\__  _\/\ \_\ \
 * \ \  __\ \ \ \-.  \\/_/\ \/\ \ \\/_/\ \/\ \____ \
 *  \ \_____\\ \_\\"\_\  \ \_\ \ \_\  \ \_\ \/\_____\
 *   \/_____/ \/_/ \/_/   \/_/  \/_/   \/_/  \/_____/
 *                                         __   ______
 *                                        /\ \ /\  ___\
 *                                       _\_\ \\ \___  \
 *                                      /\_____\\/\_____\
 *                                      \/_____/ \/_____/
 */

/**
 * Provides the EUndefinedConnection error which is used when attempting to use
 * an undefined connection.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Database
 */

var util = require('util'),
    t = require('ejs-t');

/**
 * Thrown when tryng to use an undefined connection.
 *
 * @param {String} name The name of the connection.
 *
 * @class EUndefinedConnection
 * @constructor
 * @extends Error
 */
function EUndefinedConnection(name) {
  'use strict';

  EUndefinedConnection.super_.call(this);
  Error.captureStackTrace(this, EUndefinedConnection);

  this.message = t.t(
    'The database connection ":name" hasnt been defined.',
    {':name': name}
  );
}

/**
 * Inherit from the {Error} class.
 */
util.inherits(EUndefinedConnection, Error);

/**
 * Export the error constructor.
 */
module.exports = EUndefinedConnection;
