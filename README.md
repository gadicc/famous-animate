famous-animate
==============

Provides #Animate plugin for famo.us integration in meteor.
Animate allows to define enter/leave transitions using template helpers, or use transitions defined by name.

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
          // fadeIn and invoke done() on completion
          stateModifier.setOpacity(1, { duration: 500, curve: 'easeOut' }, done);
        };
      },

      leave : function() {
        return function(stateModifier, done) {
          // fadeOut and invoke done() on completion
          stateModifier.setOpacity(0, { duration: 500, curve: 'easeOut' }, done);
        };
      }
    });

The `#Animate` view must be placed directly under e.g. `#famousEach` or `#famousIf` to allow the leave transition to work properly.
The enter/leave helpers must return a function which is invoked with a `StateModifier`, which allows all kind of complex transitions.
The enter/leave-functions has a 2nd param which is the done-handler which must be invoked at transition end.

# Global transitions
For global transitions the preferred approach is to register transitions by name.
Since most complex transition have multiple params e.g. durations, force etc. it's helpful to
create to create a transition-factory for your transition and bind it to a meaningful name.

    MySuperTransitionIn = function(duration, curve) {
      return function(stateModifier, done) {
          stateModifier.setOpacity(0); // hide initially
          // fadeIn
          stateModifier.setOpacity(1, { duration: 500, curve: 'easeOut' }, done);
      };
    }

    FView.registerTransition('in:super.fast',  MySuperTransitionIn(200, 'easeOut'));
    FView.registerTransition('in:super.slow',  MySuperTransitionIn(1000, 'easeOut'));

In the template your can now use your transitions by name.

    {{#Animate onEnter='in:super.fast' onLeave='out:super.slow'}} ... {{/Animate}}