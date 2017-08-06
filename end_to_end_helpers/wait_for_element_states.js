// Helper function to assist JavaScript functions i.e. wait for element etc.
'use strict';
/*global browser,protractor,element,by */
module.exports = function () {
    // Keep timeout value here so it only needs changing in one place if required
    var timeoutValue = 60000,
        EC = protractor.ExpectedConditions;

    return {
        waitForElement: function (element) {
            browser.wait(EC.presenceOf(element), timeoutValue);
        },
        waitForElementToBeClickable: function (element) {
            browser.wait(EC.elementToBeClickable(element), timeoutValue);
        },
        waitForElementToBeSelected: function (element) {
            browser.wait(EC.elementToBeSelected(element), timeoutValue);
        }
    };
};
