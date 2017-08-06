Feature: One Document Comparison (Version Link)

  Scenario: Click on Version Number link of 111 AUDUBON
    Given I am in: List view in the: Plans folder
    Then the file: 111 AUDUBON should be present
    Then I click on the version number of document: 111 AUDUBON
    Then the: Version History window should be visible

  Scenario: Click Compare at the top right of the Version History window
    Given I am at the: Version History window for 111 AUDUBON
    And the: Compare versions button should be visible
    When I click the: Compare versions button
    Then the: Version History window changes to the: Compare Versions window
    And the: Compare Button is visible on the window
    And the: Compare Button is clickable
    And the: Cancel Button is visible
    And the: X Button is visible
    And the checkbox for: 111 AUDUBON version 5 is selected
    And the checkbox for: 111 AUDUBON version 4 is selected

  Scenario: Deselect a checkbox in the compare versions window
    Given I am at the: Compare Versions window for document 111 AUDUBON via Version entry
    And the checkbox for: 111 AUDUBON version 4 is selected
    When the checkbox for: 111 AUDUBON version 4 is deselected
    Then the: Compare Button is disabled

  Scenario: Select a different documents checkbox
    Given I am at the: Compare Versions window for document 111 AUDUBON via Version entry
    When I select: 111 AUDUBON version 3 checkbox
    Then 111 AUDUBON version 4 is deselected
    And the: Compare Button is enabled
    And the document: 111 AUDUBON version 5 is still selected

  Scenario: Click the compare button on the Compare Versions window
    Given I am at the: Compare Versions window for document 111 AUDUBON via Version entry
    And the checkbox for: 111 AUDUBON version 5 is selected
    And the checkbox for: 111 AUDUBON version 4 is selected
    When I click the: Compare Button
    Then the: Compare Viewer should be visible
    And the document name should be: 111 AUDUBON
    And the: Side Panel should contain: 111 AUDUBON version 5
    And the: Side Panel should contain: 111 AUDUBON version 4

  Scenario: Close the Compare Viewer
    Given I am in the: Compare Viewer for document 111 AUDUBON via Version entry
    When I click the: X Button
    Then the: Compare Viewer should close
    Then I make sure I am in: list view
