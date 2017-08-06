'use strict';
/*global browser,protractor,element,by */

module.exports = function () {
    var docsHomePage = require('./docs_home.page_object.js')();

    return {
        // return public functions that interact with the private elements
        openDocs: function () {
            //browser.get(browser.params.baseUrl);
            browser.get(browser.params.baseUrl).then(null, browser.get(browser.params.baseUrl));
        },

        signIn: function (username, password) {
            browser.driver.findElement(by.id('sign_in')).click();

            browser.driver.switchTo().frame('loginframe');
            browser.driver.findElement(by.id('userName')).sendKeys(username);

            browser.driver.findElement(by.id('verify_user_btn')).click();

            // TODO: see if there is a better way to wait for this, unfortunately the browser.driver.wait isElementPresent doesn't seem to work
            browser.driver.sleep(2000); // wait for password field to be visible

            browser.driver.findElement(by.id('password')).sendKeys(password);
            browser.driver.findElement(by.id('btnSubmit')).click();

            browser.driver.wait(function () {
                return browser.driver.getCurrentUrl().then(function (url) {
                    return (/projects/).test(url);  // tests that the current URL contains the word 'projects'
                });
            }, 100000);

            docsHomePage.checkLoggedIn();
        }
    };
};
