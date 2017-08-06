protractor = require('./protractor_base.js');
var config = protractor.config;

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

config.params = {

	browserUsed: 'chrome',
	environmentUsed: 'Staging',
	testUsed: 'local',
	dateUsed: today,
	timeUsed: hour+'.'+min+'.'+sec,
	dirUsed: './reports/',
	userUsed: 'mytestingaccount@gmail.com',
	passUsed: 'myTestingPassword1',
	testNumber: '1000',
	testName: 'Staging-Regression-Test',

	baseUrl: 'https://staging.domain.com/',
	login: {
		username: 'mytestingaccount@gmail.com',
		password: 'myTestingPassword1'
	}
};

exports.config = config;

