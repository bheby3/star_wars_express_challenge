Get your Star Wars data here!

clone Repo: https://github.com/bheby3/star_wars_express_challenge.git

install: npm install

intall: bower install

run: gulp

'/character/:name' - Returns an EJS view with data about the given character. 

'/characters' - Returns raw JSON of 50 characters (doesn't matter which 50). 
This endpoint should takes a query parameter in the URL called 'sort' 
and the potential sort parameters will be 1 of the following, ['name', 'mass', 'height'] 

'/planetresidents' - Return raw JSON in the form {planetName1: [characterName1, characterName2], planetName2: [characterName3]}.
