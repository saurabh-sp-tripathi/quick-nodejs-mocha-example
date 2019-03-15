'use strict';
const assert= require('assert')
const app= require('../app')

describe('set up', function() {
    beforeEach(function() {
        console.log("Setting up stuff for test; I will be ran before each test");
    })

    it('2+2 to be 4', function() {        
        assert.equal(app.add(2, 2), 4);    
    })

    it('3 + 2 to be 5', function() {
        assert.equal(app.add(3, 2), 2);    
    })

    this.afterEach('tear down', function() {
        console.log('Tearing down i.e cleaning up after test run; I will ran after each test');
    })
})