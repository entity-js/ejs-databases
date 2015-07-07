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

var async = require('async'),
    test = require('unit.js'),
    Connection = require('../lib/connection'),
    EUndefinedConnection = require('../lib/errors/EUndefinedConnection');

var databases;

describe('ejs/databases', function () {

  'use strict';

  beforeEach(function () {

    databases = require('../lib');

  });

  afterEach(function (done) {

    delete require.cache[require.resolve('../lib')];

    var queue = [];

    function clearAndDrop(name) {
      return function (next) {
        databases.collection('test', name).drop(function () {
          databases.disconnect(name);
          next();
        });
      };
    }

    var connections = databases.connections();
    for (var i = 0, len = connections.length; i < len; i++) {
      queue.push(clearAndDrop(connections[i]));
    }

    async.series(queue, done);

  });

  describe('Databases.connect()', function () {

    it('shouldConnectAndMakeDefault', function () {

      databases.connect('default', {
        name: 'test'
      });

      test.string(
        databases.getDefault()
      ).is('default');

    });

  });

  describe('Databases.disconnect()', function () {

    it('shouldThrowAnErrorIfConnectionsUndefined', function () {

      test.exception(function () {

        databases.disconnect('test');

      }).isInstanceOf(EUndefinedConnection);

    });

    it('shouldDisconnectDefinedConnection', function () {

      databases.connect('test', {
        name: 'test'
      });

      databases.disconnect('test');

      test.bool(
        databases.connection('test')
      ).isNotTrue();

    });

    it('shouldDisconnectDefaultConnection', function () {

      databases.connect('test', {
        name: 'test'
      });

      databases.connect('test2', {
        name: 'test2'
      });

      databases.disconnect();

      test.bool(
        databases.connection('test')
      ).isNotTrue();

      test.object(
        databases.connection('test2')
      ).isInstanceOf(Connection);

    });

  });

  describe('Databases.getDefault()', function () {

    it('shouldReturnUndefinedIfNotSet', function () {

      test.value(
        databases.getDefault()
      ).isUndefined();

    });

    it('shouldReturnTheNameOfTheDefaultConnection', function () {

      databases.connect('default', {
        name: 'test'
      });

      databases.connect('test', {
        name: 'test'
      }, true);

      databases.connect('test2', {
        name: 'test'
      });

      test.string(
        databases.getDefault()
      ).is('test');

    });

  });

  describe('Databases.setDefault()', function () {

    it('shouldSetTheDefault', function () {

      databases.connect('default', {
        name: 'test'
      });

      databases.connect('test', {
        name: 'test'
      });

      test.string(
        databases.getDefault()
      ).is('default');

      databases.setDefault('test');

      test.string(
        databases.getDefault()
      ).is('test');

    });

  });

  describe('Databases.collection()', function () {

    it('shouldThrowAnErrorIfConnectionsUndefined', function () {

      test.exception(function () {
        databases.collection('test');
      }).isInstanceOf(EUndefinedConnection);

    });

    it('shouldReturnCollectionObject', function () {

      databases.connect('test', {
        name: 'test'
      });

      test.object(
        databases.collection('test')
      );

    });

  });

  describe('Databases.connection()', function () {

    it('shouldReturnFalseIfNoConnection', function () {

      test.bool(
        databases.connection('test')
      ).isNotTrue();

    });

    it('shouldReturnConnectionObjectIfExists', function () {

      databases.connect('test', {
        name: 'test'
      });

      test.object(
        databases.connection('test')
      ).isInstanceOf(Connection);

    });

  });

  describe('Databases.connections()', function () {

    it('shouldReturnAnArrayOfConnectionNames', function () {

      databases.connect('default', {
        name: 'test'
      });

      databases.connect('test', {
        name: 'test'
      });

      test.array(
        databases.connections()
      ).hasLength(2).is(['default', 'test']);

    });

  });

});
