# explicit-window

A small javascript-to-javascript compiler which converts (some) implicit assignments to window into explicit ones.

This is useful when using js-to-js compilers that wrap your code in a function expression, with code that assigns to window using mechanisms that only do so in the top scope.

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
