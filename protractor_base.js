
var _ = require('lodash');
var fs = require('fs');
var PixDiff = require('pix-diff');
var jsonfile = require('jsonfile');

var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
var sec = date.getSeconds();
var today = date.toJSON().slice(0, 10);

var dir = null;

if (hour < 10) {
	hour  = "0" + hour;
}

if (min < 10) {
	min  = "0" + min;
}

if (sec < 10) {
	sec  = "0" + sec;
}

var capabilities = {
	chrome: {
		browserName:   'chrome',
		chromeOptions: {
			args: [ '/high-dpi-support=1',
				'/force-device-scale-factor=1',
				'--lang=en',
				'--window-size=1280,1024',
				'--ignore-gpu-blacklist']
		}
	},
	firefox: {
		browserName: 'firefox',
	},
	ie: {
		browserName: 'internet explorer'
	}
};

exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	rootElement:     '[ng-app]',
	allScriptsTimeout: 80000,
	framework: 'mocha',
	mochaOpts: {
		reporter:        'mochawesome-screenshots',
		reporterOptions: {
			reportDir:            './reports/' + hour + '.' + min + '.' + sec,
			reportName:           'Default Report name' + today,    // TODO: Enter desired report name
			reportTitle:          'Default Report Title',   // TODO: Enter desired report title
			takePassedScreenshot: false,
			clearOldScreenshots:  true,
			jsonReport: true
		},
		timeout:         60000
	},
	specs: [ 'yadda_runner.js' ],
	getMultiCapabilities: function() {
		var browsers = this.params.browsers.split(',');
		// Using lodash to select the keys in `capabilities` corresponding
		// to the browsers param.
		return _( capabilities )
			.pick(browsers)
			.values()
			.value();
	},
	// Runs on start up and logs in to Docs
	onPrepare: function()
	{
		browser.pixDiff = new PixDiff
		({
			basePath: './screenshots/',
			diffPath: './screenshots/diff',
			width: 1280,
			height: 1024
		});

		browser.driver.manage().window().setSize(1280,1024);
		exports.config.mochaOpts.reporterOptions.reportTitle = 'http://jenkinsserver:8080/job/'+ browser.params.testName +'/'+ browser.params.testNumber +'/console? ' + browser.params.environmentUsed + ' ' + browser.params.testUsed + ' on ' + browser.params.browserUsed;

		dir = browser.params.dirUsed + browser.params.environmentUsed + '/' + browser.params.testUsed + '/' + browser.params.dateUsed + '/'  + browser.params.timeUsed + ' ' + browser.params.browserUsed;
		exports.config.mochaOpts.reporterOptions.reportDir = dir;

		exports.config.params.login.username = browser.params.userUsed;
		exports.config.params.login.password = browser.params.passUsed;

		browser.ignoreSynchronization = true;
		browser.driver.get(browser.params.baseUrl).then(null, browser.get(browser.params.baseUrl));
		//browser.driver.get(browser.params.baseUrl);

		browser.waitForAngular();
		browser.driver.sleep(10000);
		browser.driver.findElement(by.id('sign_in')).click();
		browser.driver.switchTo().frame('loginframe');

		browser.driver.findElement(by.id('userName')).sendKeys(browser.params.login.username);
		browser.driver.findElement(by.id('verify_user_btn')).click();

		var until = protractor.ExpectedConditions;
		browser.wait(until.visibilityOf(element(by.id('password'))), 55000, 'Element taking too long to appear in the DOM'); // wait for password field to be visible

		browser.driver.findElement(by.id('password')).sendKeys(browser.params.login.password);
		browser.driver.findElement(by.id('btnSubmit')).click();

		// Wait for login to complete
		return browser.driver.wait(function () {
			return browser.driver.getCurrentUrl().then(function (url) {
				return /projects/.test(url);  // tests that the current URL contains the word 'projects'
			});
		}, 100000);
	},

	// Runs on exit and logs out
	onComplete: function()
	{
		var fileDir = browser.params.dirUsed + browser.params.environmentUsed + '/' + browser.params.testUsed + '/' + browser.params.dateUsed + '/'  + browser.params.timeUsed + ' ' + browser.params.browserUsed;
		var fileName = exports.config.mochaOpts.reporterOptions.reportName;

		var file = fileDir + '/' + fileName + '.json';

		//console.log(file);

		var myObject = {};

		jsonfile.readFile(file, function(err, obj)
		{
			//console.log(obj);
			var percentagePassed;

			var suites = obj.stats.suites;
			var tests = obj.stats.tests;
			var passes = obj.stats.passes;
			var failed = obj.stats.failures + obj.stats.pending;

			var duration = obj.stats.duration;
			var skipped = obj.stats.skipped;

			var total = tests+skipped;
			var fail = failed+skipped;

			if (tests == 0) {
				percentagePassed = 0;
			}
			else {
				percentagePassed = (100 - ((fail)/(total))*100).toFixed(2);
			}

			myObject =
			{
				suites: suites,
				tests: tests,
				passes: passes,
				failed: failed,
				duration: duration,
				skipped: skipped,
				total: total,
				fail: fail,
				percentagePassed: percentagePassed
			};

			jsonfile.spaces = 4;

			jsonfile.writeFile(file, myObject, function(err)
			{
				console.error(err);
			});
		});

		browser.driver.findElement(by.css('div[class="UserAvatar"]')).click();
		browser.driver.findElement(by.css('button[class="UserMenu__user-signout"]')).click();
		return browser.driver.wait(function ()
		{
			return browser.driver.getCurrentUrl().then(function (url)
			{
				return /session/.test(url); // tests that the current URL contains the word 'session'
			});
		}, 100000);
	}
};