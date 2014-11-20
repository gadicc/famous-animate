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