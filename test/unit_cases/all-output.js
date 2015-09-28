window.test = undefined;
window.test2 = undefined;

window.test = function() {

};

window.test2 = function() {};
window.test = '';

expect(test).to.eq('');

expect(test2).to.be.a('function');

window.test2 = '';
