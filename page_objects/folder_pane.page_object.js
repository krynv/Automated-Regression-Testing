/**
 * Created by t_bamfj on 15/11/2016.
 */

var timeout = require('../end_to_end_helpers/wait_for_element_states')();
var robot = require('robotjs');

module.exports = function () {
    var q = require('q');
    var _ = require('lodash');
    var folderArray = [];
    var menuArray = [];

    function getRowOfDefinedFolder(folderName){
        var deferred = q.defer();
        var rowIndex;

        element.all(by.className('folder-content-container ng-pristine ng-untouched ng-valid ng-isolate-scope ng-not-empty')).then(function (resultsArray) {
            folderArray = resultsArray;
            var promises = [];
            for (var i = 0; i < folderArray.length; i++) {
                // creates an array of just the document names, which corresponds to the documents array & checkboxes array
                promises.push(folderArray[ i ].element(by.className('ng-binding')).getText());
            }

            q.promise.all(promises).then(function (textArray) {
                for (var i = 0; i < textArray.length; i++) {
                    if (textArray[ i ] === folderName) {
                        rowIndex = i;
                        deferred.resolve(rowIndex);
                    }
                }
            });
        });

        return deferred.promise;
    }

    function getRowOfDefinedMenuOption(menuOption){
        var deferred = q.defer();
        var menu = element(by.css('ul[class="menu ng-scope"]'));
        menu.all(by.css('li[class="ng-scope"]')).then(function(resultsArray){
            menuArray = resultsArray;
            var promises = [];
            for (var i = 0; i < menuArray.length; i++) {
                // creates an array of just the document names, which corresponds to the documents array & checkboxes array
                promises.push(menuArray[ i ].element(by.css('span[class="content"]')).getText());
            }

            q.promise.all(promises).then(function (textArray) {
                for (var i = 0; i < textArray.length; i++) {
                    if (textArray[ i ] === menuOption) {
                        var rowIndex = i;
                        deferred.resolve(rowIndex);
                    }
                }
            });
        });
        return deferred.promise;
    }

    return {

        clickPlansArrow: function () {
            browser.ignoreSynchronization = false;
            if (element(by.css('span[class="ng-scope folder-collapsed"]')).isPresent()) {
                element.all(by.css('span[class="ng-scope folder-collapsed"]')).then(function (a) {
                    for (var i = 1; i < a.length; i++) {
                        a[i].click();
                    }
                });
            }
        },

        checkFolderVisible: function (folder) {
            var deferred = q.defer();

            getRowOfDefinedFolder(folder).then(function (rowIndex) {
                deferred.resolve(rowIndex != null);
            });

            return deferred.promise;
        },

        clickFolderName: function (folder) {
            browser.ignoreSynchronization = false;
            getRowOfDefinedFolder(folder).then(function (rowIndex) {
                folderArray[rowIndex].click();
            });
        },

        rightClickFolderName: function (folder) {
            browser.ignoreSynchronization = false;
            getRowOfDefinedFolder(folder).then(function (rowIndex) {
                browser.actions().mouseMove(folderArray[rowIndex]).perform();
                browser.actions().click(protractor.Button.RIGHT).perform()
            });
        },

        clickFolderArrow: function (folder) {
            browser.ignoreSynchronization = false;
            getRowOfDefinedFolder(folder).then(function (rowIndex) {
                folderArray[rowIndex].element(by.css('span[class="folder-collapsed"]')).click();
            });
        },

        menuExists: function(){
            var menu = element(by.css('ul[class="menu ng-scope"]'));
            var until = protractor.ExpectedConditions;
            browser.wait(until.visibilityOf(menu), 55000, 'Element taking too long to appear in the DOM');
            return menu.isDisplayed();
        },

        menuOptionExists: function(option){
            var deferred = q.defer();
            getRowOfDefinedMenuOption(option).then(function(rowIndex){
                deferred.resolve(rowIndex != null);
            });
            return deferred.promise;
        },

        clickMenuOption: function(option){
            getRowOfDefinedMenuOption(option).then(function(rowIndex){
                element(by.css('span[class="dmfont-rightclick-add-16"]')).click();
                menuArray[rowIndex].getText().then(function(text){
                    console.log(text);
                })
            });
        },

        setFolderName: function(term){
            var nameBox = element(by.css('li[ng-repeat="node in node.folders"]'));
            element.all(by.css('li[ng-repeat="node in node.folders"]')).then(function(result){
                for(var i = 0; i < result.length; i++)
                    result[i].getText().then(function(text){
                        console.log(text);
                    });
            });
            timeout.waitForElementToBeClickable(nameBox);
            browser.driver.actions()
                .mouseMove(nameBox)
                .click()
                .sendKeys(term)
                .sendKeys(protractor.Key.ENTER)
                .perform();
        },
    }
};