
module.exports = function () {
	var q = require('q');

	var timeout = require('../end_to_end_helpers/wait_for_element_states')();

	var lnkProjectName = element(by.css('div[class="Text__content MatrixHeader__selected-item--name"'));
	var projectLink = element(by.css('div[class="MatrixHeader__selected-item"]'));
	var btn_userAvatar = element(by.css('div[class="UserAvatar"]'));
	var signOutLink = element(by.css('div[class="UserMenu__user-signout"]'));
	var listButton = element(by.css('label[uib-btn-radio="\'detail\'"]'));
	var thumbnailButton = element(by.css('label[uib-btn-radio="\'thumbnail\'"]'));

	return {

		checkLoggedIn: function () {
			browser.switchTo().defaultContent();
			timeout.waitForElement(btn_userAvatar);
			return btn_userAvatar.isDisplayed();
		},

		clickViewSelectionButton: function (view) {
			browser.ignoreSynchronization = false;
			var deferred = q.defer();

			if (view === 'list') {
				listButton.click();
				deferred.resolve(listButton.isEnabled());
			}

			if (view === 'thumbnail') {
				thumbnailButton.click();
				deferred.resolve(thumbnailButton.isEnabled());
			}

			return deferred.promise;
		},

		changeProject: function (projectName) {
			browser.ignoreSynchronization = false;

			var dropDownListProjectName = element(by.xpath('.//*[.="' + projectName + '"]'));

			lnkProjectName.getText().then(function (text) {
				if (text !== projectName) {
					projectLink.click();
					dropDownListProjectName.click();
				}
			});
		},

		getCurrentProjectName: function () {
			browser.ignoreSynchronization = false;

			return lnkProjectName.getText();
		},

		getCurrentUserName: function () {
			btn_userAvatar.click();

			return element(by.css('body > div > div > header > div > ul > li:nth-child(2) > flyout > div > div > ul > li:nth-child(1) > ul > li > div')).getText();
		},

		signOut: function () {
			browser.ignoreSynchronization = false;

			btn_userAvatar.click();
			var btn = element(by.buttonText('Sign Out'));
			timeout.waitForElement(btn);
			btn.click();
		},

		checkFolderViewVisible: function () {
			browser.ignoreSynchronization = false;

			return btn_userAvatar.isDisplayed();
		},

		checkButtonIsVisible: function (buttonName) {
			browser.ignoreSynchronization = false;

			var btn = element(by.buttonText(buttonName));
			timeout.waitForElement(btn);

			return btn.isDisplayed();
		}
	}
};
