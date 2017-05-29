# explicit-window

[![Greenkeeper badge](https://badges.greenkeeper.io/cameron-martin/explicit-window.svg)](https://greenkeeper.io/)

A small javascript-to-javascript compiler which converts (some) implicit assignments to window into explicit ones.

This is useful when using js-to-js compilers that wrap your code in an iife, with code that assigns to window using mechanisms that only do so in the top scope.

It converts:

* Variable declarations in the top scope.
* Function declarations in the top scope.

If there is anything I've missed, open up an issue.

## Installation

    npm install explicit-window

## Usage

```javascript
var explicitWindow = require('explicit-window');

var convertedFileContents = explicitWindow(fileContents);
```

## Tests

The `test/unit_cases` folder contains a set of inputs and outputs for the compiler. These inputs and outputs are themselves tests. The unit tests test whether the compiler maps each input to the corresponding output, and the integration tests test whether the assertions pass in both the inputs and outputs, when loaded into a browser. This hopefully ensures that the outputs have the same semantics as the inputs.

To run the unit tests, install mocha with

    npm install -g mocha

then run `mocha`.

To run the integration tests, open `test/integration/test.html` in your browser. The tests pass if no errors are thrown when executing the page. I'll probably find a better way of testing this at some point.
