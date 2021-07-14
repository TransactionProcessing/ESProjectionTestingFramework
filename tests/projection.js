
var fromAll = fromAll || require('../src/util').scope.fromAll;
var emit = emit || require('../src/util').scope.emit;

fromAll()
  .when({
      '$init': function () {
          return { balance: 0, counter: 0, lastCorrelationId: null, eventIds:[] }
    },
    '$any': function (state, event) {
        state.counter++;
        if (event.metadata !== null)
        {
            state.lastCorrelationId = event.metadata.correlationId;
        }
      
    },
      'cashDeposited': function (state, event)
      {
          state.eventIds.push(event.eventId);
      state.balance += event.data.deposit;
      emit('stream-222', 'emittedEvent', { a: 1 });
    }
  }
  ).transformBy(function (state) {
    return {
      "transformed": true
    };
  });
