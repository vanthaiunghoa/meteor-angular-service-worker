// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from 'meteor/tinytest';

// Import and rename a variable exported by meteor-angular-service-worker.js.
import { name as packageName } from 'meteor/ymchun:meteor-angular-service-worker';

// Write your tests here!
// Here is an example.
Tinytest.add('meteor-angular-service-worker - example', function (test) {
	test.equal(packageName, 'meteor-angular-service-worker');
});
