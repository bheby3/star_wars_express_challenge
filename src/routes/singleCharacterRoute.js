var express = require('express');
var request = require('request');

var singleCharacterRouter = express.Router();

var router = function () {

  singleCharacterRouter.route('/:name')
    .get(function (req, res) {
      if (req.params.name) {
        var id = req.params.name;
        console.log('id', id);

        var char;
        var url = 'https://swapi.co/api/people/?search=' + id;
        request({
            method: 'GET',
            uri: url,
            header: {'content-type': 'application/x-www-form-urlencoded;'},
          },
          function (error, response, body) {
            if (error) res.sendStatus(500);
            else {

              char = JSON.parse(body).results;
              console.log(char);
              res.render('singleChar', {
                title: 'May the force be with you:',
                char: char[0],
                nav: [{
                  Link: '/characters',
                  Text: 'CharacterList'
                }, {
                  Link: '/planetResidents',
                  Text: 'Planets'
                }]
              });
            }
          });
      }
    });

  return singleCharacterRouter;
};
module.exports = router;