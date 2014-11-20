// ------------------------------------

var globalTransitions = {};

AnimateView = function AnimateView(options) {
  famous.core.View.call(this, options);

  this.outer = new famous.modifiers.StateModifier();
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

      var outer = this.view.outer;

      var onEnter = data.onEnter;
      if (onEnter) {
        var t;
        if (Match.test(onEnter, String)) {
          t = globalTransitions[onEnter];
          if (!t) {
            console.log(t);
            throw new Error('No global transition \''+onEnter+'\'. Known are ' + _.keys(globalTransitions));
          }
        }
        else {
          check(onEnter, Function);
          t = onEnter;
        }
        t(outer, function(){});
      }
      var onLeave = data.onLeave;
      if (onLeave) {
        var t;
        if (Match.test(onEnter, String)) {
          t = globalTransitions[onLeave];
          if (!t) {
            throw new Error('No global transition \''+onEnter+'\'. Known are ' + _.keys(globalTransitions));
          }
        }
        else {
          check(onLeave, Function);
          t = onEnter;
        }

        this.preventDestroy();
        var destroy = _.bind(this.destroy, this);

        this.onDestroy = function() {
          t(outer, function () {
            destroy();
          });
        }
      }
    }
  });
});

FView.registerTransition = function (name, transition) {
  check(name, String);
  check(transition, Function);

  globalTransitions[name] = transition;
};

//hh
var columns = new Mongo.Collection(null);

function randomColumn() {
  var COLORS = [];
  var i;
  for (i = 0; i <= 255; i++) {
    COLORS[i] = i;
  }
  var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return {
    name: Random.choice(ABC),
    bg: 'rgb(' + Random.choice(COLORS) + ',' + Random.choice(COLORS) + ',' + Random.choice(COLORS) + ')'
  }
}

columns.insert(randomColumn());
columns.insert(randomColumn());
columns.insert(randomColumn());

Template.Letters.helpers({
  columns: function () {
    return columns.find({}, {sort: {name: 1}});
  }
});

Template.Letter.helpers({
  letterStyle: function () {
    var data = Blaze.getData();

    return {
      border: '1px solid black',
      backgroundColor: data.bg
    };
  }
});

function CrazyIn(duration, curve) {
  return function (modifier, done) {

    modifier.setAlign([0.5, 0.5]);
    modifier.setOrigin([0.5, 0.5]);

    var originalSize = modifier.getSize();

    modifier.setTransform(
      famous.core.Transform.multiply(
        famous.core.Transform.rotate(0, 0, -Math.PI),
        famous.core.Transform.scale(0.5, 0.5)
      )
    );

    modifier.setTransform(
      famous.core.Transform.multiply(famous.core.Transform.rotate(0, 0, 0), famous.core.Transform.scale(1, 1)),
      {duration: duration, curve: curve},
      done
    );
  }
}

function CrazyOut(duration1, duration2, curve) {
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

FView.registerTransition('out:crazy.fast', CrazyOut(250, 500, 'easeOut'));
FView.registerTransition('in:crazy.fast', CrazyIn(250, 'easeOut'));

Template.Letter_content.events({
  'click .add': function () {
    columns.insert(randomColumn());
  },

  'click .remove': function () {
    var id = Blaze.getData()._id;
    columns.remove(id);
  }
});