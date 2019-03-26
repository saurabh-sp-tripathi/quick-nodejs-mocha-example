'use strict';
const assert= require('assert');
const app= require('../app');

describe('set up', function() {
  beforeEach(function() {
    console.log('Setting up stuff for test; I will be ran before each test');
  });

  it('2+2 to be 4', function() {
    assert.equal(app.add(2, 2), 4);
  });

  it('3 + 2 to be 5', function() {
    assert.equal(app.add(3, 2), 2);
  });

  it.only('custom prom',function() {
    //custom promise object
    var _Promise = function() {
      this.data=null;
      this.getData = function() {
        return this.data;
      }
      this.then = function(callback, noMoreCall) {
        console.log('I am called');
        if(!noMoreCall) {
          setTimeout(() => {
            this.then(callback, true);
          }, 1000);
        }
        callback('wiw'+this.getData());
      }
      this.promise = function() {
        return this;
      }

      this.resolve = function(_data) {
        console.log('get response from server, storing it : '+_data);
        this.data = _data;        
      }
      
    };
    
    var rest_fn = function() {
      var p = new _Promise();
      setTimeout(function() {
        p.resolve('{serverdata: bleep-bloop-bleep-bloop-bleep-bloop-slow-data}');
      }, 200);

      return p.promise();
    }
    
    rest_fn().then(function(data) {
      console.log(data);
    });
    
  });

  it('demos the custom promise', function() {
    this.timeout(5000);

    let dummyHttpResponse = function(name) {
      // defer is deprecated; replaced by new Promise() more on that later
      let responsePromise = Promise.defer();   
      let fn = function(name) {
        // immitation server call by delay 1 secs  
        setTimeout(function() {
            responsePromise.resolve(name);
        }, 200);
      };
      
      // assume calling server.
      fn(name);
      return responsePromise.promise;    
    };




  })

  it('find the first winning team of super bowl ', function(){

      this.timeout(5000); 
      let dummyHttpResponse = function(name) {
        // defer is deprecated; replaced by new Promise() more on that later
        let responsePromise = Promise.defer();   
        let fn = function(name) {
          // immitation server call by delay 1 secs  
          setTimeout(function() {
              responsePromise.resolve(name);
          }, 200);
        };
        
        // assume calling server.
        fn(name);
        return responsePromise.promise;    
      };

      var getSuperBowlsSummaryByYears = function (year) {
          // e.g: year: 2018
          // e.g: return {year: 2018, winner: 'New-England-Patriots', loser: 'Eagles'}
          // or return promise
          return dummyHttpResponse({year: 2018, winner: 'New-England-Patriots', loser: 'Eagles'});
      }


      var getTeamCaptain = function(teamName) {
          // e.g: teamName: 'New-England-Patriots'
          // e.g: return {name: 'Tom Brady', dob:'01/01/1973'}
          return dummyHttpResponse({name: 'Tom Brady', dob:'01/01/1973'});
      }
      var getPlayersFirstSuperBowl = function(playerName) {
          // e.g: playerName: 'Tom Brady'
          // e.g: return {year: '2002', winner: 'New-England-Patriots', loser: 'Rams'}
          return dummyHttpResponse({year: '2002', winner: 'New-England-Patriots', loser: 'Rams'});
      }

      var getLatestSuperBowlWonByTeam = function(teamName) {
          // e.g: teamName: 'RAMS'
          // return {year: '2000', winner: '', loser: 'Titans'}
          return dummyHttpResponse({year: '2000', winner: '', loser: 'Titans'});
      }


      // without promise
      /*
      getSuperBowlsSummaryByYears(2018, function(response) {
          getTeamCaptain(response.winner, function(captain) {
              getPlayersFirstSuperBowl(captain.name, function(superBowl) {
                  getLatestSuperBowlWonByTeam(superBowl.loser, function() {
                      getTeamCaptain(superBowl.loser, function() {

                      });
                  }); 
              });
          });
      });
      */

      /**
       * - get winner of 2018
       * - Find captain of winning team
       * - Find the first super bowl of captain
       * - Find the lossing team for that super bowl
       * - Find the latest super bowl won by lossing team
       */
      getSuperBowlsSummaryByYears(2018)
      .then(function(match){
          console.log('The winnin team of 2019'+JSON.stringify(match));
          return getTeamCaptain(match.winner);
      })
      .then(function(player) {
          console.log(`Captain winning team : ${JSON.stringify(player)}`);
          return getPlayersFirstSuperBowl(player.name);
      })
      .then(function(match) {
          console.log(`The first match played by captain : ${JSON.stringify(match)}`);
          return getLatestSuperBowlWonByTeam(match.loser);
      })
      .then(function(match){
          console.log(`The latest match won by loser (of first match played by(captain of (winning team of 2018))): ${JSON.stringify(match)}`);
      });

  });

  afterEach('tear down', function() {
    console.log('Tearing down i.e cleaning up after test run; '+
    'I will ran after each test');
  });

});
