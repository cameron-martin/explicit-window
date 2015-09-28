expect(function() {
  test1;
}).to.not.throw(Error);

var test1 = false, test2 = true;

var test3, test4 = {};

var test5;

var test6 = {a : ''};

if(true) {
  var test7 = '';
}

(function() {
  var test8 = {};
})();
