# Automated Regression Testing Suite
E2E Protractor suite for testing AngularJS applications

Basic preview of the full automation suite...

This is a very quick setup guide, please get in touch for further details.

Ensure you have the following software installed:

*[node.js](https://nodejs.org/en/)
*[java](https://www.java.com/en/download/)
*[java jdk](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
*[python v2.7](https://www.python.org/download/releases/2.7/#download)
*[.NET 4.5.1](https://www.microsoft.com/en-us/download/details.aspx?id=40773)
*[Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools)

Set up the npm config. 
The following are only required if NOT on macOS:

    npm config set python python2.7
	npm config set msvs_version 2015
	npm install -g npm@next
	npm install -g node-gyp

Install dependencies: 

    npm i

Install global dependencies:

    npm i -g protractor
    npm i -g mocha

CD into the .bin folder

    cd node_modules
    cd .bin

Update the webdriver-manager:

    webdriver-manager update

Start the webdriver-manager:

    webdriver-manager start

Execute a test:

    Protractor protractor_Dev.config.js --params.browsers="chrome" 

