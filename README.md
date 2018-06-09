# Integrate new angular service worker into your meteor app

## Installation

Add meteor package
```
$ meteor add ymchun:meteor-angular-service-worker
```

Install `@angular/service-worker` using npm
```
$ npm i @angular/service-worker
```

In `app.module.ts` just following angular's doc
```ts
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
	// ...
	imports: [
		ServiceWorkerModule.register('/ngsw-worker.js', { enabled: Meteor.isProduction }),
		// import other modules
	],
	// ...
})
export class AppModule {}
```

## Configuration
On server-side, we can config the service worker and generating the `ngsw.json` file based on the config.

```ts
import { Meteor } from 'meteor/meteor';

declare module 'meteor/meteor' {
	namespace Meteor {
		let ServiceWorker: ServiceWorker;
		interface ServiceWorker {
			config: (options: object) => void;
		}
	}
}

// this is server
if (Meteor.isServer) {
	// set up service worker only on production
	Meteor.ServiceWorker.config({
		// config goes here
	});
	// do other things...
}
```

### Supported config keys
Key               | Type     |
------------------|----------|
enable            | boolean  |
appCachePattern   | string[] |
assetCachePattern | string[] |
skipFiles         | string[] |

## License
This package is MIT Licensed
