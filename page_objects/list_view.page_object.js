module.exports = function () {
	var q = require('q');
	var timeout = require('../end_to_end_helpers/wait_for_element_states')();
	var scrollIntoView = require('scroll-into-view');
	var _ = require('lodash');

	var checkBoxArray = [];
	var documentsArray = [];
	var versionLinkArray = [];
	var versionLinkOffset = 0;
	var columnInAttributeMenuArray = [];
	var columnHeaderArray = [];
	var contextMenuArray = [];
	var renameButtonArray = [];
	var offset = 1;

	var userAvatar = element(by.css('div[class="UserAvatar"]'));
	var btn_search = element(by.css('adsk-svg-search'));
	var search_panel = element(by.className('ng-pristine ng-valid ng-valid-maxlength'));
	var search_field = element(by.linkText('Search this folder'));
	var documentHolder = element.all(by.css('div.ui-grid-canvas')).get(0);

	function getRowOfDefinedDocument (documentName)
	{
		var deferred = q.defer();
		var rowIndex = -1;
		var iI = 0;


		timeout.waitForElement(documentHolder);

		element.all(by.css('document-name-cell > div[ng-controller="DocumentOperationController"]')).then(function(resultsArray)
		{
			renameButtonArray = resultsArray;
		});

		element.all(by.css('a.version-text-underline.ng-binding.ng-scope')).then(function (resultsArray) {
			versionLinkArray = resultsArray;
		});

		element.all(by.css('span[ng-if="row.entity.doc_type == \'folder\'"]')).then(function(resultsArray){
			offset = 1;
			versionLinkOffset = (resultsArray.length/2) + 1;
		});

		element.all(by.css('div[ng-controller="DocumentOperationController"] > div')).then(function (resultsArray) {
			contextMenuArray = resultsArray;
		});

		documentHolder.all(by.css('div.ui-grid-row.ng-scope')).then(function (resultsArray)
		{
			documentsArray = resultsArray;
			checkBoxArray = resultsArray;

			var promises = [];

			for (var i = 0; i < documentsArray.length; i++)
			{
				promises.push(documentsArray[ i ].element(by.className('doc-name-underline')).getText());
				promises.push(documentsArray[ i ].all(by.className('ui-grid-cell-name')).get(0).getText());
			}
			for(var i = 0; i < promises.length; i++){
				q.promise.resolve(promises[i]).then(function(text){
					if (text != '') {
						iI++;
					}
					if (text === documentName || iI === (promises.length / 2))
					{
						if (text === documentName)
							rowIndex = iI;
						deferred.resolve(rowIndex);
					}
				});
			}
		});

		return deferred.promise;
	}

	//////////////////////////////////////Attribute/ DOCS Grid Menu

	function getColumnRowForGivenAttributeMenuColumnName(columnName)
	{
		var deferred = q.defer();
		var rowIndex;

		element.all(by.css('ul.ui-grid-menu-items > li[role="menuitem"]')).then(function (resultsArray)
		{
			columnInAttributeMenuArray = resultsArray;

			var promises = [];

			for (var i = 0; i < columnInAttributeMenuArray.length; i++)
			{
				promises.push(columnInAttributeMenuArray[i].getText());
			}

			q.promise.all(promises).then(function (textArray)
			{
				for (var i = 0; i < textArray.length; i++)
				{
					// have to slice because there are two spaces('  ') in front of the column name
					if (textArray[i].slice(2, textArray[i].length) === columnName)
					{
						rowIndex = i;
						deferred.resolve(rowIndex);
					}
				}
			});
		});

		return deferred.promise;
	}

	function getGivenColumnNameColumnIndex(columnName)
	{
		var deferred = q.defer();
		var rowIndex = -1;

		element.all(by.css('span.ui-grid-header-cell-label')).then(function (resultsArray)
		{
			columnHeaderArray = resultsArray;

			var promises = [];

			for (var i = 0; i < columnHeaderArray.length; i++)
			{
				promises.push(columnHeaderArray[i].getText());
				scrollIntoView(columnHeaderArray[i]);
			}

			q.promise.all(promises).then(function (textArray)
			{
				for (var i = 0; i < textArray.length; i++)
				{
					//console.log('textArray[i]'+textArray[i]);
					if (textArray[i] === columnName)
					{
						rowIndex = i;
					}
				}
				deferred.resolve(rowIndex);
			});
		});

		return deferred.promise;
	}

	return {

		checkUserAvatarIsVisible: function ()
		{
			browser.ignoreSynchronization = false;
			return userAvatar.isDisplayed();
		},

		checkSearchButtonIsVisible: function ()
		{
			browser.ignoreSynchronization = false;
			return btn_search.isDisplayed();
		},

		checkObjectSearchIsVisible: function ()
		{
			browser.ignoreSynchronization = false;
			return search_panel.isDisplayed();
		},

		checkSearchFieldIsVisible: function ()
		{
			browser.ignoreSynchronization = false;
			return search_field.isDisplayed();
		},

		checkCurrentFolder: function ()
		{
			browser.ignoreSynchronization = false;

			var currentFolder = element(by.css('div.ng-scope.angular-ui-tree-handle.node-selected'));
			var folderText = currentFolder.element(by.css('span.ng-binding'));

			return folderText.getText();
		},

		checkForDocument: function (document)
		{
			var deferred = q.defer(0);
			var isPresent = null;

			getRowOfDefinedDocument(document).then(function (index)
			{
				if (index !== null && index !== -1)
				{
					isPresent = true;
				}
				else
				{
					isPresent = false;
				}

				deferred.resolve(isPresent);
			});
			return deferred.promise;
		},

		selectDocument: function (docName)
		{
			var deferred = q.defer();
			var checkBoxIsSelected;

			getRowOfDefinedDocument(docName).then(function (rowIndex)
			{

				var checkbox = checkBoxArray[rowIndex-offset].element(by.tagName('input'));
				var checkboxClick = checkBoxArray[rowIndex-offset].element(by.tagName('label'));

				browser.actions().mouseMove(checkboxClick).click().perform();
				checkBoxIsSelected = checkbox.isSelected();

				deferred.resolve(checkBoxIsSelected);
			});

			return deferred.promise;
		},

		checkButtonIsVisible: function (buttonName)
		{
			browser.ignoreSynchronization = false;

			var btn = element.all(by.buttonText(buttonName)).get(0);
			timeout.waitForElement(btn);

			return btn.isDisplayed();
		},

		clickButton: function (buttonName)
		{
			var btn = element.all(by.buttonText(buttonName)).get(0);
			timeout.waitForElementToBeClickable(btn);

			btn.click();
			browser.sleep(1000);
		},

		clickRestoreButton: function()
		{
			var restoreButton = element(by.css('button.restore-view-entry'));

			restoreButton.click();
		},

		checkIfRestoreButtonIsVisible: function()
		{
			var restoreButton = element(by.css('button.restore-view-entry'));

			return restoreButton.isDisplayed();
		},

		clickSearchButton: function ()
		{
			btn_search.click();
		},

		changeOrder: function(){
			browser.ignoreSynchronization = false;

			var arrow = element(by.className('ui-grid-header-cell-label ng-binding'));

			arrow.click();
		},

		//////////////////////////////////////Context Menu

		checkContextMenuButtonIsVisible: function (docName)
		{
			browser.ignoreSynchronization = false;
			var deferred = q.defer();

			getRowOfDefinedDocument(docName).then(function (rowIndex)
			{
				browser.sleep(2000);

				contextMenuArray[rowIndex-offset].click();
				var contextButton = contextMenuArray[rowIndex-offset].element(by.css('div.ui-grid-cell-contents > div.ui-grid-cell-contents-operation > span.clickable'));

				deferred.resolve(contextButton.isDisplayed());
			});

			return deferred.promise;
		},


		clickDocumentContextMenu: function (docName)
		{
			browser.ignoreSynchronization = false;

			getRowOfDefinedDocument(docName).then(function (index)
			{
				browser.sleep(2000);

				contextMenuArray[index-offset].click();
				var contextButton = contextMenuArray[index-offset].element(by.css('div.ui-grid-cell-contents > div.ui-grid-cell-contents-operation > span.dmfont-hover-more-16'));

				contextButton.click();
			});
		},

		checkContextMenuIsVisible: function () {
			browser.ignoreSynchronization = false;

			var contextMenu = element(by.className('context-menu ng-scope'));
			timeout.waitForElementToBeClickable(contextMenu);

			return contextMenu.isPresent();
		},

		checkContextMenuCompareVersions: function (option) {
			var deferred = q.defer();

			browser.ignoreSynchronization = false;

			var contextMenu = element(by.className('context-menu ng-scope'));
			timeout.waitForElementToBeClickable(contextMenu);
			contextMenu.all(by.className('ng-scope')).then(function(resultsArray){
				for(var i = 0; i < resultsArray.length; i++){
					resultsArray[i].getText().then(function(text){
						if(text === option){
							deferred.resolve(true);
						}
					});
				}
			});


			return deferred.promise;
		},

		clickContextMenuCompareVersions: function (option) {
			var deferred = q.defer();

			browser.ignoreSynchronization = false;
			var index = 0;
			var contextMenu = element(by.className('context-menu ng-scope'));
			timeout.waitForElementToBeClickable(contextMenu);
			contextMenu.all(by.className('ng-scope')).then(function(resultsArray){
				for(var i = 0; i < resultsArray.length; i++){
					resultsArray[i].getText().then(function(text){
						index++;
						if(text === option){
							contextMenu.all(by.className('ng-scope')).get(index-1).click();
							deferred.resolve(true);
						}
					});
				}
			});

			return deferred.promise;
		},

		clickVersionLink: function (docName) {
			getRowOfDefinedDocument(docName).then(function (rowIndex) {
				browser.actions().mouseMove(versionLinkArray[rowIndex-versionLinkOffset]).click().perform();
			});
		},

		//////////////////////////////////////Error Message for Move/Copy
//		checkIfErrorMessageIsVisible: function()
//		{
//			browser.ignoreSynchronization = false;
//
//			var errorMessageContainer = element(by.className('growl-container growl-fixed top-right'));
//			var errorMessage = errorMessageContainer.element(by.className('growl-item alert'));
//
//
//			return errorMessage.isDisplayed();
//		},

		//////////////////////////////////////Attribute/ DOCS Grid Menu

		checkIfPlusSymbolForAttributesIsVisible: function()
		{
			browser.ignoreSynchronization = false;

			var plusSymbolForAttributes = element(by.className('ui-grid-icon-menu'));

			return plusSymbolForAttributes.isDisplayed();
		},

		clickPlusSymbolForAttributes: function()
		{
			browser.ignoreSynchronization = false;

			var plusSymbolForAttributes = element(by.className('ui-grid-icon-menu'));

			return plusSymbolForAttributes.click();
		},

		checkIfGridAttributeMenuIsVisible: function()
		{
			browser.ignoreSynchronization = false;

			var gridAttributeMenu = element(by.className('ui-grid-menu ng-scope'));

			return gridAttributeMenu.isDisplayed();
		},

		checkForColumnNameInAttributeMenu: function (columnName)
		{
			browser.ignoreSynchronization = false;
			var deferred = q.defer(0);
			var isPresent = null;

			getColumnRowForGivenAttributeMenuColumnName(columnName).then(function (index)
			{
				if (index !== null)
				{
					isPresent = true;
				}
				else
				{
					isPresent = false;
				}

				deferred.resolve(isPresent);

			});
			return deferred.promise;
		},

		clickGivenColumnInAttributeMenu: function(columnName)
		{
			getColumnRowForGivenAttributeMenuColumnName(columnName).then(function (rowIndex)
			{
				browser.actions().mouseMove(columnInAttributeMenuArray[rowIndex]).click().perform();
			});
		},

		checkIfGivenColumnIsVisible: function(columnName)
		{
			browser.ignoreSynchronization = false;
			var isPresent = null;
			var deferred = q.defer();

			getGivenColumnNameColumnIndex(columnName).then(function(rowIndex)
			{
				if (rowIndex !== null)
				{
					isPresent = true;

					if(rowIndex == -1)
					{
						isPresent = false;
					}
				}
				else
				{
					isPresent = false;
				}

				deferred.resolve(isPresent);
			});

			return deferred.promise;
		},

		// Version Number

		checkVersionNumber: function(documentName, versionNumber)
		{
			browser.ignoreSynchronization = false;
			var deferred = q.defer();
			var isCorrectValue = false;

			getRowOfDefinedDocument(documentName).then(function (rowIndex)
			{
				versionLinkArray[rowIndex].getText().then(function (result)
				{
					if (result === versionNumber)
					{
						isCorrectValue = true;
					}

					deferred.resolve(isCorrectValue);
				});
			});

			return deferred.promise;
		},

		/////////////////////////// Rename Button

		checkDocumentRenameButtonIsVisible: function (docName)
		{
			browser.ignoreSynchronization = false;
			var deferred = q.defer();

			getRowOfDefinedDocument(docName).then(function (rowIndex)
			{
				browser.sleep(2000);
				renameButtonArray[rowIndex-offset].click();
				var renameButton = renameButtonArray[rowIndex-offset].element(by.css('div.ui-grid-cell-contents > div.ui-grid-cell-contents-operation > span#renameDocument'));

				deferred.resolve(renameButton.isDisplayed());
			});

			return deferred.promise;
		},

		clickDocumentRenameButton: function (docName)
		{
			browser.ignoreSynchronization = false;

			getRowOfDefinedDocument(docName).then(function (rowIndex)
			{
				browser.sleep(2000);
				renameButtonArray[rowIndex-offset].click();
				var renameButton = renameButtonArray[rowIndex-offset].element(by.css('div.ui-grid-cell-contents > div.ui-grid-cell-contents-operation > span#renameDocument'));

				renameButton.click();
			});
		},

		enterGivenFileName: function(fileName)
		{
			var editContainer = element(by.className('cell-edit-container'));

			timeout.waitForElementToBeClickable(editContainer);

			browser.driver.actions()
				.mouseMove(editContainer)
				.sendKeys(protractor.Key.DELETE)
				.sendKeys(fileName)
				.sendKeys(protractor.Key.ENTER)
				.perform();
		},

		///////////////////////////////////////######################################/////////////////////////////////////

		///////////////////////////////////////CLASH CLASH CLASH CLASH CLASH CLASH////////////////////////////////////////

		clashIconExists: function()
		{
			var clashIcon = element(by.linkText('CLASHES'));

			return clashIcon.isDisplayed();
		},

		clickClashIcon: function()
		{
			var clashIcon = element(by.linkText('CLASHES'));
			clashIcon.click();
		},

		///////////////////////////////////////CLASH CLASH CLASH CLASH CLASH CLASH////////////////////////////////////////
	}
};
