var express = require('express');
var request = require('request');
var async = require('async');

var app = express();

var port = process.env.PORT || 5000;
var nav = [{
  Link: '/characters',
  Text: 'CharacterList'
}, {
  Link: '/planetResidents',
  Text: 'Planets'
}];

var singleCharacter = require('./src/routes/singleCharacterRoute')(nav);
var characters = require('./src/routes/charactersRoute')(nav);
var planet = require('./src/routes/planetRoute')(nav);


app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/character', singleCharacter);
app.use('/characters', characters);
app.use('/planetResidents', planet);


app.get('/', function (req, res) {
  var url = 'https://swapi.co/api/people/';

  request({
      method: 'GET',
      uri: url,
      header: {'content-type': 'application/x-www-form-urlencoded;'},
    },
    function (error, response, body) {
      if (error) res.sendStatus(500);
      else {

        var starWarsCharacters = JSON.parse(body).results;

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
    });
});


app.listen(port, function (err) {
  console.log('running server on port ' + port);
});


