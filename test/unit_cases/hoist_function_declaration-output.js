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

window.test2 = false;

if(true) {
  [];
}

(function() {
  function test4() {
    return {};
  }
});
