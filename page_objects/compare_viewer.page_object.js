'use strict';
/*global browser,protractor,element,by */
module.exports = function () {
    var q = require('q'),
        BlinkDiff = require('blink-diff'),
        timeout = require('../end_to_end_helpers/wait_for_element_states')(),
        closeSidePanelButton = element(by.css('span.compare-viewer-modal-close')),
        closeViewerButton = element(by.css('a.compare-viewer-modal-close'));

    return {

        checkViewerCloseButtonIsVisible: function () {
            //used in order to test non-angular sites, it ignores all timeouts and http calls, so it is pointless to use browser.sleep or browser.driver.sleep here, among other things
            browser.ignoreSynchronization = true;

            //waits (indefinitely (until the global timeout)) for the element to be clickable
            timeout.waitForElementToBeClickable(closeViewerButton);

            return closeViewerButton.isDisplayed();
        },

        closeViewer: function () {
            timeout.waitForElementToBeClickable(closeViewerButton);
            //click() and browser.actions().%mouseEvent% can be used interchangeably however browser.actions() is a promise and needs resolving with .perform() or .then()
            closeViewerButton.click();
        },

        waitForViewerToLoad: function () {
            timeout.waitForElement(element.all(by.id('navTools')).get(0));
            browser.sleep(5000);
        },

        checkSidePanelDocumentVersionSelected: function (version) {
            var deferred = q.defer(),
            //grab an element
                selected = element(by.css('.dm-panel-cell.selected')),
            //grab an element that is contained within another element
                ver = selected.element(by.className('document-version'));

            browser.ignoreSynchronization = false;
            version = 'V' + version;
            //The following is used to resolve a promise, getText() returns a promise, the then() resolves it to get its true value
            ver.getText().then(function (text) {
                deferred.resolve(text === version);
            });

            return deferred.promise;
        },

        checkStackedButtonIsEnabled: function () {
            var stackedButton = element(by.css('div.compare-viewer-image-button.stacked.selected'));

            return stackedButton.isDisplayed();
        },

        ////////////////////////////////////////ALIGNMENT

        checkAlignButtonIsVisible: function () {
            var align = element(by.css('div.compare-viewer-image-button.align'));

            timeout.waitForElement(align);
            return (align.isDisplayed());
        },

        clickAlignButton: function () {
            var align = element(by.css('div.compare-viewer-image-button.align'));

            timeout.waitForElementToBeClickable(align);
            align.click();
            align = element(by.css('div.compare-viewer-image-button.align.selected'));

            return (align.isDisplayed());
        },

        docHighlighted: function (doc) {
            //a deferred variable can be used in order to resolve a value that would usually return as a promise
            var deferred = q.defer(),
                document = element(by.css('.dm-panel-cell.selected')),
                docName = document.element(by.id('document-name'));

            docName.getText().then(function (text) {
                var result = (doc === text);
                deferred.resolve(result);
            });

            return deferred.promise;
        },

        imgCompare: function (img1, img2, out) {
            var deferred = q.defer(),
                output = null,
                diff = new BlinkDiff({
                    imageAPath: img1, // Use file-path
                    imageBPath: img2,

                    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
                    threshold: 0.1, // 10% threshold

                    imageOutputPath: out
                });

            diff.run(function (error, result) {
                if (error) {
                    throw error;
                }
                output = diff.hasPassed(result.code);
                deferred.resolve(output);
            });

            return deferred.promise;
        },

        /////////////////////////////////////////Zoom/Pan

        checkPanAndZoomAreVisible: function () {
            var panAndZoom = element.all(by.id('navTools')).get(0);

            browser.ignoreSynchronization = false;
            timeout.waitForElement(panAndZoom);

            return panAndZoom.isDisplayed();
        },

        clickZoomButton: function () {
            var zoomBtn = element.all(by.css('div#toolbar-zoomTool')).get(1);

            timeout.waitForElement(zoomBtn);
            zoomBtn.click();
        },

        clickPanButton: function () {
            var panBtn = element.all(by.id('toolbar-panTool')).get(0);

            timeout.waitForElement(panBtn);
            panBtn.click();
        },

        //////////////////////////////Slider
        checkSliderButtonVisible: function () {
            var sliderBtn = element(by.css('div[class="compare-viewer-image-button slider"]'));

            return sliderBtn.isDisplayed();
        },

        clickSliderButton: function () {
            var sliderBtn = element(by.css('div[class="compare-viewer-image-button slider"]'));

            sliderBtn.click();
        },

        checkSliderVisible: function () {
            var slider = element(by.id('ty_stack_splitter')),
                actualSlider = slider.element(by.className('splitter-center-mark'));

            return actualSlider.isDisplayed();
            //844 x 401
        },

        checkTopRightText: function (doc) {
            var deferred = q.defer(),
                label = element(by.id('version-label-touchable')),
                name = label.element(by.css('div.label-text'));

            browser.ignoreSynchronization = true;
            name.getText().then(function (text) {
                var result = (text === doc);
                deferred.resolve(result);
            });

            return deferred.promise;
        },

        checkTopLeftText: function (doc) {
            var deferred = q.defer(),
                label = element(by.id('version-label-passive')),
                name = label.element(by.css('div.label-text'));

            browser.ignoreSynchronization = true;
            name.getText().then(function (text) {
                var result = (text === doc);
                deferred.resolve(result);
            });

            return deferred.promise;
        },

        getLeftTooltipText: function () {
            var tooltip = element(by.id('tooltip-passive'));

            return tooltip.getText();
        },

        checkTopLeftTooltip: function () {
            browser.ignoreSynchronization = false;

            var label = element(by.id('version-label-passive')),
                tooltip;
            timeout.waitForElementToBeClickable(label);
            label.click();

            tooltip = element(by.id('tooltip-passive'));
            timeout.waitForElement(tooltip);
            browser.sleep(3000);

            return tooltip.isDisplayed();
        },

        getRightTooltipText: function () {
            var tooltip = element(by.id('tooltip-touchable'));

            return tooltip.getText();
        },

        checkTopRightTooltip: function () {
            browser.ignoreSynchronization = false;

            var label = element(by.id('version-label-touchable')),
                tooltip;
            timeout.waitForElementToBeClickable(label);
            label.click();

            tooltip = element(by.id('tooltip-touchable'));
            timeout.waitForElement(tooltip);
            browser.sleep(3000);

            return tooltip.isDisplayed();
        },
        /////////////////////////////Colour

        checkColorButtonVisible: function () {
            var color = element(by.css('div.compare-viewer-image-button.color'));

            return color.isDisplayed();
        },

        clickColorButton: function () {
            var color = element(by.css('div.compare-viewer-image-button.color'));

            timeout.waitForElementToBeClickable(color);
            color.click();
            color = element(by.css('div.compare-viewer-image-button.color.selected'));

            return color.isDisplayed();
        },

        blueDocColour: function () {
            var stripe = element(by.css('div.blueLine'));

            return stripe.isDisplayed();
        },

        redDocColour: function () {
            var stripe = element(by.css('div.redLine'));

            return stripe.isDisplayed();
        },

        //////////////////////////////////Side Panel

        checkSidePanelDocumentVersion: function (version) {
            var deferred = q.defer(),
                itExists = null;

            version = 'V' + version;
            browser.ignoreSynchronization = false;
            element.all(by.className('document-version ng-binding')).then(function (resultsArray) {
                var promises = [],
                    i;

                for (i = 0; i < resultsArray.length; i++) {
                    // creates an array of just the document names, which corresponds to the documents array & checkboxes array
                    promises.push(resultsArray[i].getText());
                }

                q.promise.all(promises).then(function (textArray) {
                    for (i = 0; i < textArray.length; i++) {
                        if (textArray[i] === version) {
                            itExists = true;
                            deferred.resolve(itExists);
                        }
                    }
                });
            });

            return deferred.promise;
        },

        checkTitle: function (title) {
            var deferred = q.defer(),
                isCorrectTitle = null,
                titleBarText = element(by.className('dm-modal-header ng-binding'));

            browser.ignoreSynchronization = false;
            titleBarText.getText().then(function (text) {
                isCorrectTitle = (text === title);

                deferred.resolve(isCorrectTitle);
            });

            return deferred.promise;
        },

        checkSidePanelIsOpen: function () {
            browser.ignoreSynchronization = true;

            return closeSidePanelButton.isDisplayed();
        },

        closeSidePanel: function () {
            browser.ignoreSynchronization = true;
            timeout.waitForElementToBeClickable(closeSidePanelButton);
            closeSidePanelButton.click();

            return closeSidePanelButton.isDisplayed();
        },

        checkBurgerStateSelected: function () {
            var ele = element(by.css('div[class="dm-pivotbar--item selected"]'));

            browser.ignoreSynchronization = true;

            return ele.isDisplayed();
        },

        checkBurgerStateUnselected: function () {
            var ele = element(by.css('div[class="dm-pivotbar--item"]'));

            browser.ignoreSynchronization = true;

            return ele.isDisplayed();
        },

        clickBurgerMenu: function () {
            var ele = element(by.css('div[class="dm-pivotbar--item"]'));

            browser.ignoreSynchronization = true;
            ele.click();

            return ele === null;
        }

    };

};