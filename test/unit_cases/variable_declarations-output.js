window.test1 = undefined, window.test2 = undefined;
window.test3 = undefined, window.test4 = undefined;
window.test5 = undefined;
window.test6 = undefined;
window.test7 = undefined;
expect(function() {
  test1;
}).to.not.throw(Error);

window.test1 = false, window.test2 = true;
window.test4 = {};
window.test6 = {a : ''};

if(true) {
  window.test7 = '';
}

(function() {
  var test8 = {};
})();
