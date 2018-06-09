// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See meteor-angular-service-worker-tests.js for an example of importing.
import { Meteor } from 'meteor/meteor';

export const name = 'meteor-angular-service-worker';

// configurations
let _enable = true;
let _appCachePattern = [];
let _assetCachePattern = [];
let _skipFiles = [
	'robots.txt',
	'manifest.json',
	'ngsw.json',
	'ngsw-worker.js',
];

Meteor.ServiceWorker = {
	config: (configs) => {
		Object.keys(configs).forEach(
			(key) => {
				// get config value
				const value = configs[key];
				// assign value to default config
				if (key === 'enable') {
					_enable = !!value;
				} else if (key === 'appCachePattern') {
					_appCachePattern = [ ..._appCachePattern, ...value ];
				} else if (key === 'assetCachePattern') {
					_assetCachePattern = [ ..._assetCachePattern, ...value ];
				} else if (key === 'skipFiles') {
					_skipFiles = [ ..._skipFiles, ...value ];
				} else {
					throw new Error('Invalid config option: ' + key);
				}
			},
		);
	},
};

const isDynamic = (resource) => {
	return resource.type === 'dynamic js' ||
		(
			resource.type === 'json' &&
			resource.url.startsWith('/dynamic/') &&
			resource.url.endsWith('.map')
		);
};

WebApp.connectHandlers.use(
	(req, res, next) => {
		// serve worker script
		if (req.url !== '/ngsw-worker.js') {
			return next();
		}

		// check if enabled
		if (!_enable) {
			res.writeHead(404);
			res.end();
			return;
		}

		// create body buffer
		const body = Buffer.from(Assets.getText('.npm/package/node_modules/@angular/service-worker/ngsw-worker.js'));

		// send to client
		res.setHeader('Content-Type', 'application/javascript');
		res.setHeader('Content-Length', body.length);
		return res.end(body);

	},
);

WebApp.connectHandlers.use(
	(req, res, next) => {
		// serve run-time config file
		if (!req.url.startsWith('/ngsw.json')) {
			return next();
		}

		// check if enabled
		if (!_enable) {
			res.writeHead(404);
			res.end();
			return;
		}

		let ngsw = {
			configVersion: 1,
			index: '/',
			appData: {
				clientHash: WebApp.clientHash(),
				autoupdateVersion: Package.autoupdate.Autoupdate.autoupdateVersion,
			},
			assetGroups: [
				{
					name: 'app',
					installMode: 'prefetch',
					updateMode: 'prefetch',
					urls: [],
					patterns: _appCachePattern,
				},
				{
					name: 'assets',
					installMode: 'lazy',
					updateMode: 'prefetch',
					urls: [],
					patterns: _assetCachePattern,
				},
			],
			dataGroups: [],
			hashTable: {},
			navigationUrls: [],
		};

		// load cache files
		WebApp.clientPrograms[WebApp.defaultArch].manifest.forEach(
			(resource) => {
				if (resource.where === 'client' && !RoutePolicy.classify(resource.url) && !isDynamic(resource)) {
					// skip caching ngsw files
					if (!RegExp(`(${_skipFiles.join("|").split(".").join("\\.")})`, 'g').test(resource.url)) {
						// check assets or app scripts
						if (RegExp('(favicon\.ico|\.html|\.css|\.js)', 'g').test(resource.url)) {
							// app scripts
							ngsw.assetGroups[0].urls.push(resource.url);
						} else {
							// asset files
							ngsw.assetGroups[1].urls.push(resource.url);
						}
						// hash table
						ngsw.hashTable[resource.url] = resource.hash;
					}
				}
			},
		);

		// create body buffer
		const body = Buffer.from(JSON.stringify(ngsw));

		// send to client
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Content-Length', body.length);
		return res.end(body);
	},
);
