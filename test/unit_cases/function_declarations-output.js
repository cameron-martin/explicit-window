window.test1 = function(param) {
  return false;
};

window.test2 = function(param) {
  return false;
};

window.test3 = function(param) {
  return {};
};

window.test1 = false;

expect(test2).to.be.a('function');

window.test2 = false;

if(true) {
  [];
}

(function() {
  function test4() {
    return {};
  }
});
