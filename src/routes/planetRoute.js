var express = require('express');
var request = require('request');
var async = require('async');

var planetRouter = express.Router();

var router = function () {

  planetRouter.route('/')
    .get(function (req, res) {

      let url = 'http://swapi.co/api/planets/';

      request({
        method: 'GET',
        uri: url,
        header: {'content-type': 'application/x-www-form-urlencoded;'},
      }, function (error, response, body) {
        if (error) res.sendStatus(500);
        else {
          let planets = JSON.parse(body).results;

          /*Get Urls for each planet resident*/
          let residentUrlArray = planets.map(function (planet) {
            return planet.residents;
          });

          /*flatten resident url array to for async.map and fetch*/
          var merged = residentUrlArray.concat.apply([], residentUrlArray);

          /*Fetch each Resident */
          var fetch = function (fetch, cb) {
            request.get(fetch, function (err, response, body) {
              if (err) {
                cb(err);
              } else {
                cb(null, JSON.parse(body));
              }
            });
          };

          async.map(merged, fetch, function (err, results) {
            if (err) {
              console.log(err);
            } else {
              mapResults(results, planets);
            }
          });
        }
      });

      /*Format object with planet{planet: [residents[0])*/
      function mapResults(residents, planets) {

        /*create object format {planet: []}*/
        let format = planets.map(function (planet) {
          let key = planet.name.toString();
          let planetObj = {};
          planetObj[key] = [];
          if (planet.residents.length > 0) {
            for (let i = 0; i < planet.residents.length; i++) {
              planetObj[key].push(planet.residents[i]);
            }
          }
          return planetObj;
        });
          /*create list of names from arguments*/
        let residentNames = residents.map(function (resident) {
          return resident.name;
        });
        /*create an array for number of residents per planet*/
        let numberResidentsPerPlanet = format.map(function (planet) {
          let num;
          for (prop in planet) {
            num = planet[prop].length;
          }
          return num;
        });
        /*pass in the residents for each planet*/
        function rePopulatePlanets() {
          let count = 0;
          let j = 0;
          let newResArray = numberResidentsPerPlanet.map(function (x) {
            let list = [];
            let i = 0;
            j = count;
            while (i < x) {
              list.push(residentNames[j]);
              i++;
              j++;
            }
            count += x;
            return list;
          });
          /*format object to JSON*/
          function planetsRepopulated() {
            let i = 0;
            let planetsRepopulated = planets.map(function (planet) {
              let key = JSON.stringify(planet.name);
              let planetObj = {};
              planetObj[key] = newResArray[i];
              i++;
              return planetObj;
            });
            return planetsRepopulated;
          }
          return planetsRepopulated
        }

        let finishedPlanetsObj = rePopulatePlanets()();

        res.send(finishedPlanetsObj);
      }

    });

  return planetRouter;
};
module.exports = router;