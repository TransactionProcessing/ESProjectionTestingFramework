require('chai').should();
const { expect } = require('chai');
var projection = require('../src/util');
require('./projection');

describe('Projection tests', function () {
    beforeEach(function () {
        projection.initialize();
  });

  it('should increment balance on cashDeposited event when initial balance is set', function () {
      projection.setState({ balance: 10, eventIds: [] });
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 }, null, "71C475A7-A843-4FF7-AAD8-F1FD6A238097");
    projection.getState().balance.should.equal(20);
  });

  it('should increment balance on cashDeposited event without initial balance', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 },null,"67824B7D-3889-499E-9FE5-4E3FB2D0BDF0");
    projection.getState().balance.should.equal(10);
  });

  it('should not increment balance on unregistered event', function () {
    projection.processEvent('stream-123', 'NON_EXISTING_EVENT_TYPE', { deposit: 10 },null, "36812531-2CD1-4DD2-AA63-6CB7295D4617");
    projection.getState().balance.should.equal(0);
  });

  it('should increment counter for every event', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 },null, "C0FD6A3E-7D53-4813-97A2-4D3DE64844DD");
    projection.processEvent('stream-123', 'NON_EXISTING_EVENT_TYPE', { deposit: 10 }, null,"E8AC1450-CE0D-4B01-9C3C-1AE6761C45FB");
    projection.getState().counter.should.equal(2);
  });

  it('should remember last correlationId from metadata', function () {
    expect(projection.getState().lastCorrelationId).to.be.null;
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 }, { correlationId: 1 }, null, "AB98FF64-199B-4B39-AED0-F87AF68D3185");
    projection.getState().lastCorrelationId.should.equal(1);
    projection.processEvent('stream-456', 'cashDeposited', { deposit: 20 }, { correlationId: 2 }, null, "E82562DB-5938-46F4-8FB6-FC0FB8A1650D");
    projection.getState().lastCorrelationId.should.equal(2);
  });

  it('should re-emit all cashDeposited events', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 }, null, "E100A68A-A25C-486B-B669-673935FA304A");
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 }, null, "BBD3DEA4-AA02-4773-B028-0EDD6569542D");
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 }, null, "E486C08F-BA56-4EDA-86AA-020560C5FB60");
    projection.emittedEvents.should.have.length(3);
  });

  it('should transformBy', function () {
    projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 },null, "1BB705BA-D5BC-41FA-8EA2-B500CAF7F856");
    projection.getState().balance.should.equal(10);
    projection.getTransform().transformed.should.true;
  });

  it('should have event ids', function ()
  {
      var eventId = "8A43BE10-A916-4637-906A-6AA29BAF8C47";
      projection.processEvent('stream-123', 'cashDeposited', { deposit: 10 }, null, eventId);
      projection.getState().balance.should.equal(10);
      projection.getState().eventIds[0].should.equal(eventId);
  });

});