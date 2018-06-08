Package.describe({
	name: 'ymchun:meteor-angular-service-worker',
	version: '1.2.1',
	// Brief, one-line summary of the package.
	summary: 'Integrate angular service worker into meteor',
	// URL to the Git repository containing the source code for this package.
	git: 'https://github.com/ymchun/meteor-angular-service-worker',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

Npm.depends({
	'@angular/service-worker': '6.0.4',
});

Package.onUse(function(api) {
	api.versionsFrom('1.6.1');
	api.use('ecmascript', ['client', 'server']);
	api.use(['webapp', 'routepolicy'], 'server');
	api.use('autoupdate', 'server', { weak: true });
	api.addAssets('.npm/package/node_modules/@angular/service-worker/ngsw-worker.js', 'server');
	api.mainModule('meteor-angular-service-worker.js', 'server');
});

Package.onTest(function(api) {
	api.use([
		'ecmascript',
		'tinytest',
		'ymchun:meteor-angular-service-worker'
	]);
	api.mainModule('meteor-angular-service-worker-tests.js');
});
