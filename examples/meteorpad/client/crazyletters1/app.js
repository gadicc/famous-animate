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