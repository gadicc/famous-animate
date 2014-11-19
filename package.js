Package.describe({
	summary: 'provides #Animate view',
  version : "0.0.6",
  name : 'mjn:famous-animate',
  git : 'https://github.com/mj-networks/famous-animate.git'
});

var S = 'server';
var C = 'client';
var CS = [C, S];

Package.onUse(function (api) {
	api.use('check@1.0.2');
	api.use('underscore@1.0.1');
  api.use('templating@1.0.7');
  api.use('blaze@2.0.1');
  api.use('mjn:famous@0.3.0_5');
  api.imply('mjn:famous@0.3.0_5');
  api.use('gadicohen:famous-views@0.1.25',C);
  api.imply('gadicohen:famous-views@0.1.25');

	api.add_files('src/AnimateView.js', C);
});

Package.onTest(function (api) {
	api.use('mjn:famous-animate');
  api.use('tinytest');
  api.use('test-helpers');
  api.use('templating');
  api.use('blaze');
  api.use('less');
  api.use('spacejamio:sinon@1.10.3_1');
  api.use('spacejamio:chai@1.9.2_2');
  api.use('gadicohen:famous-views@0.1.25',C);

  api.add_files([
    'test/TestStyles.less',
    'test/TestUtils.js',

    'test/AnimateTests.html',
    'test/AnimateTests.js'
    ], C);
});
