'use strict';

function util() {
  var self = this;
    
  self.commandHandlers = {};

  var $on = function (name, commandHandler) {
    self.commandHandlers[name] = commandHandler;
  };

  self.emittedEvents = [];

  var $notify = function (action, event) {
    if (action === 'emit')
      self.emittedEvents.push(JSON.parse(event));
  };

    self.scope = require('../prelude/1Prelude')($on, $notify);
    self.getState = function () {
    return JSON.parse(self.commandHandlers.debugging_get_state());
  };

  self.setState = function (state) {
    self.commandHandlers.set_state(JSON.stringify(state));
  };

    self.processEvent = function (streamId, eventType, event, metadata, eventId) {
        //function(event,
        //isJson,
        //    streamId,
        //    eventType,
        //    category,
        //    sequenceNumber,
        //    metadata,
        //    linkMetadata,
        //    partition,
        //    eventId)
        self.state = self.commandHandlers.process_event(event,
            true,
            streamId,
            eventType,
            undefined,
            undefined,
            JSON.stringify(metadata),
            null,
            null,
            eventId);
  };

  self.getTransform = function () {
    var transform = self.commandHandlers.transform_state_to_result();
    return transform && JSON.parse(transform);
  };

  this.initialize = function () {
    self.emittedEvents = [];
    self.commandHandlers.initialize();
  };
}

module.exports = new util();