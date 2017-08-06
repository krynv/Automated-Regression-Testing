/**
 * Created by Vitaliy Krynytskyy on 23/02/2017.
 */
var robot = require('robotjs');
var path = require ('path');
var timeout = require('../end_to_end_helpers/wait_for_element_states')();

module.exports = function () {

    return {

        uploadFile: function(file){
            browser.driver.getAllWindowHandles().then(function(handles) {
                console.log(handles[0]);
                browser.driver.switchTo().window(handles[0]);
            });
            var uploadPath = path.resolve(__dirname, '../resources/' ,file);
            robot.setKeyboardDelay(1000);
            robot.typeStringDelayed("  ", 60);
            robot.keyTap("backspace");
            robot.keyTap("backspace");
            //console.log(uploadPath); //for debugging
            robot.typeString(uploadPath);
            robot.keyTap("enter");
            browser.sleep(3000);
        },

        uploadMenu: function(){
            var menu = element(by.css('div[class="menu-content"]'));
            var option = menu.element(by.xpath('//*[contains(text(), Files)]'));
            return option.isDisplayed() && menu.isDisplayed();
        },

        menuOptionClick: function(){
            var menu = element(by.css('div[class="menu-content"]'));
            var menuOption = menu.element(by.css('li[data-ng-click="selectFiles($event)"]'));
            menuOption.click();
        },

        addDocuments: function(){
            var add = element(by.css('div.file-transfer-dialog.ng-isolate-scope'));
            var until = protractor.ExpectedConditions;
            browser.wait(until.visibilityOf(add), 55000, 'Element taking too long to appear in the DOM');
            return add.isDisplayed();
        },

        waitForDoc: function(){
            var complete = element(by.className('complete dmfont-upload-done'));
            var until = protractor.ExpectedConditions;
            browser.wait(until.visibilityOf(complete), 55000, 'Element taking too long to appear in the DOM');
            return complete.isDisplayed();
        },

        waitForDelete: function(){
            var notification = element(by.css('div.growl-item.alert.ng-scope.alert-success.icon.alert-dismissable'));
            var until = protractor.ExpectedConditions;
            browser.wait(until.elementToBeClickable(notification), 55000, 'Element taking too long to appear in the DOM');
            return notification.isDisplayed();
        },

        clickFilesOption: function(){
            browser.ignoreSynchronization = false;

            var files = element(by.css('ul[class="upload-context-menu menu ng-scope"]'));
            var until = protractor.ExpectedConditions;
            browser.wait(until.elementToBeClickable(files), 55000, 'Element taking too long to appear in the DOM');
            element(by.css('li[data-ng-click="selectFiles($event)"]')).click();
            browser.driver.sleep(1000);
        }
    }

};