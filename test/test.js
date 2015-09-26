var expect = require('chai').expect;
var fs = require("promised-io/fs");
var Promise = require("promise");

var explicitWindow = require('../index.js');

var path = require('path');

function getTestCases(dirName) {
  var groupList = [];

  var files = fs.readdirSync(dirName);

  files.forEach(function(fileName) {

    var match = fileName.match(/(.*)-input\.js/);
    if(!match) {
      return;
    }
    var testName = match[1];

    var outputFileName = testName + '-output.js';

    if(files.indexOf(outputFileName) === -1) {
      return;
    }

    groupList.push({
      inputName: fileName,
      outputName: outputFileName,
      input: path.join(dirName, fileName),
      output: path.join(dirName, outputFileName),
      testName: testName
    });
  });

  return groupList;
}

var testCases = getTestCases(path.join(__dirname, 'unit_cases'));


testCases.forEach(function(testCase) {
  describe('Test Case: ' + testCase.testName, function() {
    it('compiles ' + testCase.inputName + ' to ' + testCase.outputName, function() {
      return Promise.all([fs.readFile(testCase.input, 'utf8'), fs.readFile(testCase.output, 'utf8')]).then(function(contents) {
        var input = contents[0],
            output = contents[1];

        expect(explicitWindow(input)).to.equal(output);
      })
    });
  });
});
