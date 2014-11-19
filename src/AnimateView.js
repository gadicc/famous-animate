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

	    if (data.onEnter) {
		    check(data.onEnter, Function);
		    data.onEnter(outer);
	    }
	    if (data.onLeave) {
		    check(data.onLeave, Function);

		    this.preventDestroy();
		    var destroy = _.bind(this.destroy, this);

		    this.onDestroy = function() {
			    data.onLeave(outer, function () {
				    destroy();
			    });
		    }
	    }
    }

  });
});
