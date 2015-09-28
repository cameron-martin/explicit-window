window.test1 = false;

function test1(param) {
  return false;
}

expect(test2).to.be.a('function');

window.test2 = false;

function test2(param) {
  return false;
}

if(true) {
  [];

  function test3(param) {
    return {};
  }
}

(function() {
  function test4() {
    return {};
  }
});
