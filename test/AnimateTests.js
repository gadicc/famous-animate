Tinytest.addAsync('Famous - #Animate - xxx', function (test, complete) {
	var root = createTestDIV([200, 200], test);

	Template.AnimateTests1.rendered = function() {
		_.defer(function () {
			complete();
		});
	};

	Blaze.render(Template.AnimateTests1, root);
});