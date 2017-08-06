/**
 * Created by Vitaliy Krynytskyy on 27/09/2016.
 */
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var docsHomePage = require('../../page_objects/docs_home.page_object.js')();
var listView = require('../../page_objects/list_view.page_object.js')();
var compareViewer = require('../../page_objects/compare_viewer.page_object')();
var historyWindow = require('../../page_objects/history_window.page_object')();
var folderPane = require('../../page_objects/folder_pane.page_object')();

module.exports = (function (library) {

    return library

    //Scenario: Click on Version Number link of 111 AUDUBON
        .define("I am in: $view view in the: $folder folder", function (view, folder, next) {
            folderPane.clickPlansArrow();
            expect(docsHomePage.clickViewSelectionButton(view)).to.be.eventually.equal(true, "Expecting documents to be in " + view + " view");
            folderPane.clickFolderName(folder);
            expect(listView.checkCurrentFolder()).to.eventually.equal(folder, "Expecting folder name to equal: " + folder).notify(next);
        })
        .define("the file: $document should be present", function (document, next) {
            browser.waitForAngular();
            listView.checkForDocument(document).then(function(result){
                if(result === false){
                    pending("File not found");
                } else {
                    next();
                }
            })

        })
        .define("I click on the version number of document: $document", function (document, next){
            listView.clickVersionLink(document);
            next();
        })
        .define("the: $title window should be visible", function (title, next) {
            expect(historyWindow.checkVersionWindowIsVisible(title)).to.be.eventually.equal(true, "Expecting window with title: " + title + " to be visible").notify(next);
        })

    //Scenario: Click Compare at the top right of the Version History window
        .given("I am at the: $title window for $document", function (title, document, next) {
            listView.clickVersionLink(document);
            expect(historyWindow.checkVersionWindowIsVisible(title)).to.be.eventually.equal(true, "Expecting window with title: " + title + " to be visible").notify(next);
        })
        .define("the: Compare link is visible", function (next){
            expect(historyWindow.checkCompareLinkIsVisible()).to.be.eventually.true.notify(next);
        })
        .define("the: $link link is clicked", function (link, next) {
            listView.clickButton("Compare versions");
            next();
        })
        .define("the: $title1 window changes to the: $title2 window", function (title1, title2, next) {
            expect(historyWindow.checkVersionWindowIsVisible(title2)).to.be.eventually.equal(true, "Expecting window with title: " + title2 + " to be visible").notify(next);
        })
        .define("the: $button Button is visible on the window", function (button, next) {
            expect(historyWindow.checkCompareWindowCompareButtonIsVisible(button)).to.be.eventually.equal(true, "Expecting the: " + button + " button to be visible").notify(next);
        })
        .define("the: Compare Button is clickable", function (next) {
            expect(historyWindow.checkCompareWindowCompareButtonIsClickable()).to.be.eventually.equal(true, "Expecting the: Compare button to be clickable").notify(next);
        })
        .define("the: $button Button is visible", function (button, next) {
            expect(listView.checkButtonIsVisible(button)).to.be.eventually.equal(true, "Expecting the " + button + " button to be visible").notify(next);
        })
        .define("the: X Button is visible", function (next) {
            expect(historyWindow.checkCompareWindowCloseIsVisible()).to.be.eventually.equal(true, "Expecting the 'X' button to be visible").notify(next);
        })
        .define("the checkbox for: $document version $version is selected", function (document, version, next) {
            expect(historyWindow.getDocumentVersionCheckboxState(version)).to.be.eventually.equal(true, "Expecting this version: v" + version + "of this document: " + document + " to be selected").notify(next);
        })
        //the checkbox for: 111 AUDUBON version 4 is selected -  c0_One_Document_(Version_Link).steps.js

    //Scenario: Deselect a checkbox in the compare versions window
        .given("I am at the: $title window for document $document via Version entry", function (title, document, next) {
            listView.clickVersionLink(document);
            listView.clickButton("Compare versions");
            expect(historyWindow.checkVersionWindowIsVisible(title)).to.be.eventually.equal(true, "Expecting window with title: " + title + " to be visible").notify(next);
        })
        //the checkbox for: 111 AUDUBON version 4 is selected -  c0_One_Document_(Version_Link).steps.js
        .define("the checkbox for: $document version $version is deselected", function (document, version, next) {
            expect(historyWindow.selectDocumentVersion(version)).to.be.eventually.equal(false, "Expecting this version: v" + version + "of this document: " + document + " NOT to be selected").notify(next);
        })
        .define("the: Compare Button is $state", function (state, next){
            if (state === 'disabled')
                expect(historyWindow.checkCompareWindowCompareButtonIsClickable()).to.be.eventually.equal(false, "Expecting the button: Compare to be disabled").notify(next);
            else
                expect(historyWindow.checkCompareWindowCompareButtonIsClickable()).to.be.eventually.equal(true, "Expecting the button: Compare to be enabled").notify(next);
        })

    //Scenario: Select a different documents checkbox
        //I am at the: Compare Versions window for document 111 AUDUBON via Version entry -  c0_One_Document_(Version_Link).steps.js
        .define("I select: $document version $version checkbox", function (document, version, next){
            expect(historyWindow.selectDocumentVersion(version)).to.be.eventually.equal(true, "Expecting the checkbox for this version: v" + version + "of this document: " + document + " to be selected").notify(next);
        })
        .define("$document version $version is deselected", function (document, version, next){
            expect(historyWindow.getDocumentVersionCheckboxState(version)).to.be.eventually.equal(false, "Expecting the checkbox for this version: v" + version + "of this document: " + document + " NOT to be selected").notify(next);
        })
        //the: Compare Button is enabled -  c0_One_Document_(Version_Link).steps.js
        .define("the document: $document version $version is still selected", function (document, version, next){
            expect(historyWindow.getDocumentVersionCheckboxState(version)).to.be.eventually.equal(true, "Expecting the checkbox for this version: v" + version + "of this document: " + document + " to be selected").notify(next);
        })

    //Scenario: Click the compare button on the Compare Versions window
        //I am at the: Compare Versions window for document 111 AUDUBON via Version entry -  c0_One_Document_(Version_Link).steps.js
        //the checkbox for: 111 AUDUBON version 5 is selected -  c0_One_Document_(Version_Link).steps.js
        //the checkbox for: 111 AUDUBON version 4 is selected -  c0_One_Document_(Version_Link).steps.js
        .define("I click the: Compare Button", function (next){
            historyWindow.clickCompareWindowCompareButton();
            next();
        })
        .define("the: Compare Viewer should be visible", function (next){
            expect(compareViewer.checkViewerCloseButtonIsVisible()).to.be.eventually.equal(true, "Expecting Compare Viewer to be open").notify(next);

        })
        .define("the document name should be: $document", function(document, next) {
            expect(compareViewer.checkTitle(document)).to.be.eventually.equal(true, "Expecting the name of this compared document to be: " + document).notify(next);
        })
        .define("the: Side Panel should contain: $document version $version", function(document, version, next){
            expect(compareViewer.checkSidePanelDocumentVersion(version)).to.be.eventually.equal(true, "Expecting the Side Panel to contain this version: v" + version + "of this document: " + document).notify(next);
        })
        //And the: Side Panel should contain: 111 AUDUBON version 4 -  c0_One_Document_(Version_Link).steps.js

    //Scenario: Close the Compare Viewer
        .given("I am in the: Compare Viewer for document $document via Version entry", function(document, next){
            listView.clickVersionLink(document);
            expect(historyWindow.checkVersionWindowIsVisible('Version History')).to.be.eventually.equal(true, "Expecting window with title: Version History to be visible");
            listView.clickButton("Compare versions");
            expect(historyWindow.checkVersionWindowIsVisible('Compare Versions')).to.be.eventually.equal(true, "Expecting window with title: Compare Versions to be visible");
            historyWindow.clickCompareWindowCompareButton();
            expect(compareViewer.checkViewerCloseButtonIsVisible()).to.be.eventually.equal(true, "Expecting Compare Viewer to be open").notify(next);
        })
        .define("I click the: X Button", function (next){
            compareViewer.closeViewer();
            next();
        })
        .define("the: Compare Viewer should close", function (next){
            expect(listView.checkUserAvatarIsVisible()).to.be.eventually.equal(true, "Expecting Compare Viewer to be closed").notify(next);
        })
        .define("I make sure I am in: $view view", function (view, next) {
            expect(docsHomePage.clickViewSelectionButton(view)).to.be.eventually.equal(true, "Expecting documents to be in list view").notify(next);
        })
        .define("I select the file: $document", function (document, next) {
            browser.waitForAngular();
            expect(listView.selectDocument(document)).to.be.eventually.equal(true, "Expecting document: " +document+ " checkbox to be checked").notify(next);
        })
        .define("the: $button button should be visible", function (button, next) {
            expect(listView.checkButtonIsVisible(button)).to.be.eventually.equal(true, "Expecting the " + button + " button to be visible").notify(next);
        })
        .define("I click the: $button button", function (button, next) {
            listView.clickButton(button);
            next();
        })
        .define("the viewer should open", function (next) {
            expect(compareViewer.checkViewerCloseButtonIsVisible()).to.be.eventually.equal(true, "Expecting Compare Viewer to be open");
            next();
        })
});