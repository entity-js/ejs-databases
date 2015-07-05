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
 * Setup the database connection.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Database
 */

var util = require('util'),
    events = require('events'),
    mongojs = require('mongojs'),
    merge = require('ejs-merge');

/**
 * Build a connection URI from a config bject.
 *
 * @method configToURI
 * @param {Object} config The config object.
 * @return {String} The generated connection URI.
 */
function configToURI(config) {
  'use strict';

  var uri = '';
  if (config.user) {
    uri += config.user;

    if (config.pass) {
      uri += ':' + config.pass;
    }

    uri += '@';
  }

  uri += config.host ? config.host : '0.0.0.0';
  if (config.port) {
    uri += ':' + config.port;
  }

  uri += '/' + config.name;
  return uri;
}

/**
 * The Connection class.
 *
 * @class Connection
 * @construct
 * @param {String} name The unique ID of the database connection.
 * @param {Object} config The database config object.
 *   @param {String} [config.user] The database username.
 *   @param {String} [config.pass] The database password.
 *   @param {String} [config.host='0.0.0.0'] The database host.
 *   @param {Integer} [config.port=27017] The database port.
 *   @param {String} config.name The name of the database to use.
 */
function Connection(name, config) {
  'use strict';

  Connection.super_.call(this);

  merge(config, {
    host: '0.0.0.0',
    port: 27017
  });

  Object.defineProperty(this, 'name', {value: name});
  Object.defineProperty(this, '_db', {
    value: mongojs(configToURI(config))
  });

  var me = this;
  this._db.on('error', function (err) {
    me.emit('error', me, err);
  });

  this._db.on('ready', function () {
    me.emit('ready', me);
  });
}

util.inherits(Connection, events.EventEmitter);

/**
 * Get a collection from the mongo database.
 *
 * @method collection
 * @param {String} collection The name of the collection to return.
 * @returns {Collection} A mongodb collection.
 */
Connection.prototype.collection = function (name) {
  'use strict';

  return this._db.collection(name);
};

/**
 * Close the database connection.
 *
 * @method close
 * @returns {Connection} Returns self.
 * @chainable
 */
Connection.prototype.close = function () {
  'use strict';

  this._db.close();
  return this;
};

/**
 * Export the Databsase constructor.
 */
module.exports = Connection;
