var express = require('express');
var request = require('request');
var async = require('async');

var charactersRouter = express.Router();

var router = function () {

  charactersRouter.route('/')
    .get(function (req, res) {

        /*base url for star wars characters*/
        var url = 'https://swapi.co/api/people/';

        /*create array of 50 character urls*/
        var merged = function getUrls() {
          var array = [];
          for (let i = 1; i <= 50; i++) {
            array.push(url + i)
          }
          return array;
        };

        /*Get the first 50 star wars characters*/
        var fetch = function (url, cb) {
          request.get(url, function (err, response, body) {
            if (err) {
              cb(err);
            } else {
              cb(null, JSON.parse(body));
            }
          });
        };
        async.map(merged(), fetch, function (err, results) {
          if (err) {
            console.log(err);
          } else {
            mapResults(results)
          }
        });

        function mapResults(results) {

          /*filter undesired results*/
          var starWarsCharacters = results.map(function (resident) {
            if (resident && !resident.detail && resident !== "null") {
              return resident
            }
            else return results[0];
          });

          /* filter results if req.query.sort*/
          if (req.query.sort) {
            if (req.query.sort === 'name') {
              starWarsCharacters.sort(function (a, b) {
                console.log(a, b);
                return b[req.query.sort] < a[req.query.sort]
              });
            } else {
              starWarsCharacters.sort(function (a, b) {
                console.log(a, b);
                return parseInt(b[req.query.sort]) - parseInt(a[req.query.sort]);
              });
            }

            /*send query results by EJS or JSON*/
            // res.send(starWarsCharacters);
            res.render('index', {
              title: 'Hello from render',
              starChar: starWarsCharacters,
              nav: [{
                Link: '/characters',
                Text: 'CharacterList'
              }, {
                Link: '/planetResidents',
                Text: 'Planets'
              }]
            });
          } else {

            /*if no query send results by EJS or JSON*/

            // res.send(starWarsCharacters);
            res.render('index', {
             title: 'Hello from render',
             starChar: starWarsCharacters,
             nav: [{
             Link: '/characters',
             Text: 'CharacterList'
             }, {
             Link: '/planetResidents',
             Text: 'Planets'
             }]
             });
          }
        }
      }
    );

  return charactersRouter;
};
module.exports = router;

/*app.get('/', function (req, res) {
 var url = 'https://swapi.co/api/people/';

 var merged = function getUrls() {
 var array = [];
 for (var i = 1; i <= 50; i++) {
 array.push(url + i)
 }
 return array;
 };

 var fetch = function (url, cb) {
 request.get(url, function (err, response, body) {
 if (err) {
 cb(err);
 } else {
 cb(null, JSON.parse(body));
 }
 });
 };

 async.map(merged(), fetch, function (err, results) {
 if (err) {
 console.log(err);
 } else {
 mapResults(results)
 }
 });

 function mapResults(results) {

 var starWarsCharacters = results.map(function (resident) {
 if (resident && !resident.detail && resident !== "null") {
 return resident
 }
 else return results[0];
 });

 if (req.query.sort) {
 if(req.query.sort === 'name') {
 starWarsCharacters.sort(function (a, b) {
 console.log(a, b);
 return b[req.query.sort] < a[req.query.sort]
 });
 } else {
 starWarsCharacters.sort(function (a, b) {
 console.log(a, b);
 return parseInt(b[req.query.sort]) - parseInt(a[req.query.sort]);
 });
 }
 // console.log('\n\n\n star sorted:', starWarsCharacters);
 // res.send(starWarsCharacters);
 res.render('index', {
 title: 'Hello from render',
 starChar: starWarsCharacters,
 nav: [{
 Link: '/planetResidents',
 Text: 'Planets'
 }]
 });
 } else {
 // res.send(starWarsCharacters)
 res.render('index', {
 title: 'Hello from render',
 starChar: starWarsCharacters,
 nav: [{
 Link: '/planetResidents',
 Text: 'Planets'
 }]
 });
 }

 }

 });*/
