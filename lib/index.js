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
    listener = require('ejs-listener'),
    ejsStatic = require('ejs-static'),
    Connection = require('./connection'),
    EUndefinedConnection = require('./errors/EUndefinedConnection');

var _databases = ejsStatic('ejs-databases', {
      _default: null,
      _connections: {}
    }).get();

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

  if (_databases._connections[name]) {
    return this;
  }

  _databases._connections[name] = new Connection(name, config);
  if (makeDefault || !_databases._default) {
    _databases._default = name;
  }

  var me = this;
  _databases._connections[name].on('error', function (connection, err) {
    me.emit('error', connection, err);
    listener.emit('databases.error', name, connection, err);
  });

  _databases._connections[name].on('ready', function (connection) {
    me.emit('read', connection);
    listener.emit('databases.ready', name, connection);
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
 * @throws {EUndefinedConnection} Thrown if the connection isnt defined.
 * @chainable
 */
Databases.prototype.disconnect = function (name) {
  'use strict';

  if (!name) {
    name = _databases._default;
  }

  if (_databases._connections[name] === undefined) {
    throw new EUndefinedConnection(name);
  }

  _databases._connections[name].close();
  delete _databases._connections[name];
  if (_databases._default === name) {
    _databases._default = undefined;
  }

  listener.emit('databases.disconnect', name);

  return this;
};

/**
 * Sets the default connection.
 *
 * @method setDefault
 * @param {String} name The name of the connection to set as default.
 * @return {Databases} Returns self.
 * @throws {EUndefinedConnection} If the connection isnt defined.
 * @chainable
 */
Databases.prototype.setDefault = function (name) {
  'use strict';

  if (_databases._connections[name] === undefined) {
    throw new EUndefinedConnection(name);
  }

  _databases._default = name;
  listener.emit('databases.default', name);

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

  return _databases._default;
};

/**
 * Gets a collection.
 *
 * @method collection
 * @param {String} name The name of the collection to return.
 * @param {String} [connection] The name of the collection, if not provided
 *   the default connection will be used.
 * @return {Collection} Returns a mongodb collection.
 * @throws {EUndefinedConnection} Thrown if the connection is undefined.
 */
Databases.prototype.collection = function (name, connection) {
  'use strict';

  if (!connection) {
    connection = _databases._default;
  }

  if (_databases._connections[connection] === undefined) {
    throw new EUndefinedConnection(connection);
  }

  return _databases._connections[connection].collection(name);
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
    name = _databases._default;
  }

  return _databases._connections[name] ? _databases._connections[name] : false;
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
  for (var name in _databases._connections) {
    connections.push(name);
  }

  return connections;
};

/**
 * Exports a Databases object.
 */
module.exports = new Databases();
