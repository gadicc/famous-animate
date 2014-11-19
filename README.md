famous-animate
==============

Provides #Animate plugin for famo.us integration in meteor.
Animate allows to define enter/leave transitions using template helpers.

Demo: http://meteorpad.com/pad/rXrmAYnMtuP7rnFeD/#Animate proposal

    <template name="example">
      {{#Animate size='[200,undefined]' onEnter=enter onLeave=leave}}
        {{#Surface}}
          ...
        {{/Surface}}
      {{/Animate}}
    </template>

    Template.example.helpers({
      enter : function() {
        return function(stateModifier, done) {
          stateModifier.setOpacity(0); // hide initially
          // fadeIn
          stateModifier.setOpacity(1, { duration: 500, curve: 'easeOut' }, done);
        };
      },

      leave : function() {
        return function(stateModifier, done) {
          // fadeOut
          stateModifier.setOpacity(0, { duration: 500, curve: 'easeOut' }, done);
        };
      }
    });

The #Animate must be placed directly under e.g. `#famousEach` or `#famousIf` to allow the leave transition to work properly.
The enter/leave helpers must return a function which is invoked with a StateModifier, which allows all kind of complex transitions.
The enter/leave-functions has a 2nd param which is the done-handler which must be invoked at transition end.
Common enter/leave transitions could also be a in a global object and selected by name.