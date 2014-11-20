Tinytest.addAsync('Famous - #Animate - onEnter function called on first render', function (test, complete) {
	var root = createTestDIV([200, 200], test);

	var enterSpy = sinon.spy();

	Template.AnimateTests1.helpers({
		enter : function () {
			return enterSpy;
		}
	});

	Template.AnimateTests1.rendered = function() {
		_.defer(function () {
			test.equal(enterSpy.callCount, 1);
			complete();
		});
	};

	Blaze.render(Template.AnimateTests1, root);
});