var fs = require('fs');
var urls = require('../resources/urls');

var list = [];
var names = [];

var i = 1;
var getMovies = function(){
    while(i <= 1831){
      var file = urls.WATCH32.MOVIESLIST_JSON_PATH.concat(i,'.json');
      var moviesList = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log("Parsed file - " + i + " with " + moviesList.length + " movies");
      list.push.apply(list, moviesList);
      i++;
    }

    j = 0;
    while(j < list.length){
      console.log(list[j].name);
      names.push(list[j].name);
      j++;
    }

    names.sort();

    console.log("Total Movies - " + list.length);
    fs.writeFile('Watch32MoviePages/MovieList.json', JSON.stringify(list, null, 4), function(err){

        console.log('MovieList successfully written! - Check your --Watch32MoviePages-- directory for the .json file');
    })

    fs.writeFile('Watch32MoviePages/MovieNames1.json', JSON.stringify(names, null, 4), function(err){

        console.log('MovieNames successfully written! - Check your --Watch32MoviePages-- directory for the .json file');
    })
}

getMovies();
