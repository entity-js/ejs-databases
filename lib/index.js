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
 * The main databases component.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Database
 */

var util = require('util'),
    events = require('events'),
    Connection = require('./connection'),
    EUndefinedConnection = require('./errors/EUndefinedConnection');

var _default,
    _connections = {};

/**
 * The Databases object constructor.
 *
 * @construct
 */
function Databases() {
  'use strict';

  Databases.super_.call(this);
}

util.inherits(Databases, events.EventEmitter);

/**
 * Setup a new connection.
 *
 * @method connect
 * @param {String} name The name to give the connection.
 * @param {Object} config The database configuration object.
 * @param {Boolean} [makeDefault=false] Set to true to make as the default
 *   connection, if there is no default connection this will be set to true.
 * @return {Databases} Returns self.
 * @chainable
 */
Databases.prototype.connect = function (name, config, makeDefault) {
  'use strict';

  if (_connections[name]) {
    return this;
  }

  _connections[name] = new Connection(name, config);
  if (makeDefault || !_default) {
    _default = name;
  }

  var me = this;
  _connections[name].on('error', function (connection, err) {
    me.emit('error', connection, err);
  });

  _connections[name].on('ready', function (connection) {
    me.emit('ready', connection);
  });

  return this;
};

/**
 * Close and destroy the specified connection.
 *
 * @method disconnect
 * @param {String} [name] The name of the connection to disconnect, if not
 *   provided then default is assumed.
 * @return {Databases} Returns self.
 *
 * @throws {EUndefinedConnection} Thrown if the connection isnt defined.
 * @chainable
 */
Databases.prototype.disconnect = function (name) {
  'use strict';

  if (!name) {
    name = _default;
  }

  if (_connections[name] === undefined) {
    throw new EUndefinedConnection(name);
  }

  _connections[name].close();
  delete _connections[name];
  if (_default === name) {
    _default = undefined;
  }

  return this;
};

/**
 * Sets the default connection.
 *
 * @method setDefault
 * @param {String} name The name of the connection to set as default.
 * @return {Databases} Returns self.
 *
 * @throws {EUndefinedConnection} If the connection isnt defined.
 * @chainable
 */
Databases.prototype.setDefault = function (name) {
  'use strict';

  if (_connections[name] === undefined) {
    throw new EUndefinedConnection(name);
  }

  _default = name;
  return this;
};

/**
 * Gets the name of the default connection.
 *
 * @method getDefault
 * @return {String} The default connections name.
 */
Databases.prototype.getDefault = function () {
  'use strict';

  return _default;
};

/**
 * Gets a collection.
 *
 * @method collection
 * @param {String} name The name of the collection to return.
 * @param {String} [connection] The name of the collection, if not provided
 *   the default connection will be used.
 * @return {Collection} Returns a mongodb collection.
 *
 * @throws {EUndefinedConnection} Thrown if the connection is undefined.
 */
Databases.prototype.collection = function (name, connection) {
  'use strict';

  if (!connection) {
    connection = _default;
  }

  if (_connections[connection] === undefined) {
    throw new EUndefinedConnection(connection);
  }

  return _connections[connection].collection(name);
};

/**
 * Get the connection object.
 *
 * @method connection
 * @param {String} [name] The name of the connection to return, if not
 *   provided then the default is returned.
 * @return {Connection|Boolean} Returns the database connection or false.
 */
Databases.prototype.connection = function (name) {
  'use strict';

  if (!name) {
    name = _default;
  }

  return _connections[name] ? _connections[name] : false;
};

/**
 * Get all the defined connections.
 *
 * @method connections
 * @return {Object} An object containing the defined connections.
 */
Databases.prototype.connections = function () {
  'use strict';

  var connections = [];
  for (var name in _connections) {
    connections.push(name);
  }
  
  return connections;
};

/**
 * Exports a Databases object.
 */
module.exports = new Databases();
