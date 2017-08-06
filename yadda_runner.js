// Integrate Yadda with Mocha so we can use Gherkin and step definitions
var path = require('path');
var glob = require('glob');

var Yadda = require('yadda');
var englishLibrary = require('yadda').localisation.English;

var chai = require('chai');
// chai as promised is like chai but uses promises for asynchronous tests (when you're not using angular then it waits for a call back from your test
// to say that the current task has completed,  the program will then progress.
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

Yadda.plugins.mocha.StepLevelPlugin.init();

// import Page Objects
var docsHomePage = require('./page_objects/docs_home.page_object.js')();
var signIn = require('./page_objects/sign_in.page_object')();

new Yadda.FeatureFileSearch('./tests/features').each(function (file) {

	//  The before and after statements specify the conditions to be met
	//  BEFORE each feature is run i.e. 'Refresh Docs and Open correct project'.
	//  and AFTER each feature has been run i.e. 'reset docs'
	//  This means that for each feature the browser starts and ends in the expected state

	featureFile(file, function (feature) {
		// Loop through all files in the step definitions folder and require them into one vast library for all features to use
		// this prevents code duplication across the step definitions
		var library = englishLibrary.library();

		var lastLibrary = library;
		var nextLibrary;

		glob.sync('./tests/steps/*.steps.js').forEach(function (file) {
			nextLibrary = require(path.resolve(file))(lastLibrary);
			lastLibrary = nextLibrary;
		});

		var definitions = lastLibrary;

		var yadda = Yadda.createInstance(definitions);

		// run the feature
		scenarios(feature.scenarios, function (scenario) {

			before(function (next) {
				browser.refresh();
				next();
			});

			steps(scenario.steps, function (step, done) {
				yadda.run(step, done);
			});

			after(function (next) {
				//if (browser.params.browserUsed =='chrome')
				//	browser.manage().logs().get('browser').then(function(browserLog) {
				//		console.log('\n log: ' + require('util').inspect(browserLog) + '\n');
				//	});
				next();
			});
		});
	});
});