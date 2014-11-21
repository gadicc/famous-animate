/**
 * need to include the source code here, until package mjn:fview-animate can be found by meteorpad -----------------
 */
var globalTransitions = {};

AnimateView = function AnimateView(options) {
  famous.core.View.call(this, options);

  this.outer = new famous.modifiers.StateModifier();
  this.on('turn', function(e) {
    alert(e);
  });
};

AnimateView.prototype = _.extend(Object.create(famous.core.View.prototype), {

  render: function () {
    var currentNode = this.sequence;

    var result = [];

    while (currentNode) {
      var item = currentNode.get();
      if (!item) break;

      result.push({
        target: item.render()
      });

      currentNode = currentNode.getNext();
    }

    return this.outer.modify(result);
  },

  sequenceFrom: function (array) {
    this.sequence = new famous.core.ViewSequence(array);
  },

  getSize: function (actual) {
    return actual ? this.outer : this.options.size;
  }
});

FView.ready(function (require) {
  FView.registerView('Animate', AnimateView, {

    famousCreatedPost: function () {
      var data = Blaze.getData();
      var transitionFn;

      var outer = this.view.outer;

      var onEnter = data.onEnter;
      if (onEnter) {
        if (Match.test(onEnter, String)) {
          transitionFn = globalTransitions[onEnter];
          if (!transitionFn) {
            console.log(transitionFn);
            throw new Error('No global transition \''+onEnter+'\'. Known are ' + _.keys(globalTransitions));
          }
        }
        else {
          check(onEnter, Function);
          transitionFn = onEnter;
        }
        transitionFn(outer, function(){});
      }
      var onLeave = data.onLeave;
      if (onLeave) {
        if (Match.test(onEnter, String)) {
          transitionFn = globalTransitions[onLeave];
          if (!transitionFn) {
            throw new Error('No global transition \''+onEnter+'\'. Known are ' + _.keys(globalTransitions));
          }
        }
        else {
          check(onLeave, Function);
          transitionFn = onEnter;
        }

        this.preventDestroy();
        var destroy = _.bind(this.destroy, this);

        this.onDestroy = function() {
          transitionFn(outer, function () {
            destroy();
          });
        }
      }

      this.pipeChildrenTo = this.parent.pipeChildrenTo ? [ this.view, this.parent.pipeChildrenTo[0] ] : [ this.view ];
    }
  });
});

FView.registerTransition = function (name, transition) {
  check(name, String);
  check(transition, Function);

  globalTransitions[name] = transition;
};

/**
 * --------------------- example starts here -------------------------------------------
 */

Template.Letter.rendered = function () {
  var fview = FView.from(Blaze.currentView);

  debugger

  this.on('turn', function(e) {
    alert(e);
  });
};

Template.Letter.helpers({
  letterStyle: function () {
    var data = Blaze.getData();

    return {
      border: '1px solid black',
      backgroundColor: data.bg
    };
  }
});

function Turn(duration1, duration2, curve) {
  return function (modifier, done) {
    modifier.setOpacity(0, {duration: duration1, curve: curve});

    modifier.setTransform(
      famous.core.Transform.multiply(
        famous.core.Transform.rotate(0, 0, -Math.PI),
        famous.core.Transform.scale(0.1, 0.1)
      ),
      {duration: duration2, curve: curve}, done
    );
  }
}

FView.registerTransition('turn.fast', Turn(250, 500, 'easeOut'));

Template.Letter_content.events({
  'click .turn': function () {
    var fview = FView.from(Blaze.currentView);
    console.log(fview);

    fview.surface.emit('turn', {value : 4711});
  }
});