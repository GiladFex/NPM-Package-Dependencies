var aJSON = {
  "name": "a",
  "version": "2.1.1",
  "dependencies": {
    "a_mock": "1.0.5",
    "a_test": "1.0.9"
  }};

var reactJSON = {
  "name": "react",
  "version": "16.2.0",
  "dependencies": {
    "fbjs": "^0.8.16",
    "loose-envify": "^1.1.0",
    "object-assign": "^4.1.1",
    "prop-types": "^15.6.0"
  }};
var assert = chai.assert;
describe("main.js" , function(){
    describe("GetDependencies() with A Package " , function(){
        it("should find 56 dependencies for the a package;" , function(){
            GetDependencies(aJSON);
                  setTimeout(function() {
                    assert.equal(Nodes.length, 56);
                  }, 10000)
        });
    });
    describe("GetDependencies() with React Package " , function(){
        it("should find 16 dependencies for the a package;" , function(){
            GetDependencies(reactJSON);
                  setTimeout(function() {
                    assert.equal(Nodes.length, 16);
                  }, 10000)
        });
    });
});
