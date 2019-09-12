var express = require('express');
var async = require('async');
var fs = require('fs');
var jsonfile = require('jsonfile');
var webdriverio = require('webdriverio');

var firebaseSetup = require('./firebaseSetup');
var selectors = require('../resources/selectors');
var urls = require('../resources/urls');
var moviesPageInstance = require('./getMoviesList');
var videosInstance = require('./getVideoUrl');
var queueTasks = require('./queue');


var app = express();

//total pages to scrape
var fmoviesPages = 430;
var _123moviesPages = 321;
var watch32moviesPages = 1814;
var  i = 1;
//url to navigate to
var fMoviesUrl = urls.FMOVIES.BASE_URL + urls.FMOVIES.MOVIES_PAGE_RELATIVE_URL;
var _123MoviesUrl = urls._123MOVIES.BASE_URL + urls._123MOVIES.MOVIES_PAGE_RELATIVE_URL;
var watch32MoviesUrl = urls.WATCH32.BASE_URL + urls.WATCH32.MOVIES_PAGE_RELATIVE_URL;

var fMoviesSleepTimer, _123MoviesSleepTimer, watch32SleepTimer;
var fMoviesList = [];
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
var webdriver =  webdriverio.remote(options).init();



//request function for Fmovies
var getFMoviesList = function() {
  moviesPageInstance.getFMoviesList(fMoviesUrl + i, i, function(returnedList){
    fMoviesList.push.apply(fMoviesList, returnedList);

    fs.writeFile('fmovieDetails/'+ i +'-'+ fMoviesList.length +'.json', JSON.stringify(fMoviesList, null, 4), function(err){

         console.log('FMovies total movies - ' + fMoviesList.length +' successfully written! - Check your --fmovieNewPages-- directory for the .json file');

     })
  });
  i++;
  if(i > 0){
    clearInterval(fMoviesSleepTimer);
    /*fs.writeFile('fmovieDetails/'+ i +'-'+ fMoviesList.length +'.json', JSON.stringify(fMoviesList, null, 4), function(err){

         console.log('FMovies total movies - ' + fMoviesList.length +' successfully written! - Check your --fmovieNewPages-- directory for the .json file');

     })*/
  }
};


//request function for Fmovies Videos
var getFMoviesVideosUrl = function() {

  if(i <= fmoviesPages){
    var movieFinalList = [];
    var file = urls.FMOVIES.MOVIESLIST_JSON_PATH.concat(i,'-32.json');
    var moviesList = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log("Movies list  - " + moviesList);

    //queue async tasks
    queueTasks(moviesList,
              1,
              function(movieItem, callback){
                videosInstance.getFMoviesVideoUrl(webdriver, movieItem, function(videoUrl){
                  var movieFinalItem = {
                      movieName: movieItem.movieName,
                      server: videoUrl
                  }
                  movieFinalList.push(movieFinalItem);
                  console.log("Added video url for movie - "+ movieItem.movieName);

                  if(movieFinalList >= 32){
                    fs.writeFile('fmovieWithVideo/'+ i +'.json', JSON.stringify(movieFinalList, null, 4), function(err){

                         console.log('FMovies total movies - ' + movieFinalList.length +' successfully written for i = ' +  i + '!! - Check your --fmovieWithVideo-- directory for the .json file');
                         i++;
                         getFMoviesVideosUrl();
                    })
                  }

                  callback();
                });
              },
            function(){
              console.log("All movies are sent for getting server url for i = " + i);
            });
  }
  else{
    console.log("::::::::::::: Task Completed ::::::::::::::");
  }

};

//request function for 123 movies
var get123MoviesList = function() {
  moviesPageInstance.get123MoviesList(_123MoviesUrl + i, i);
  i++;
  if(i >= _123moviesPages){
    clearInterval(_123MoviesSleepTimer);
  }
};

var watch32MovieList = [];
//request function for Watch32 movies
var getWatch32MoviesList = function() {
  moviesPageInstance.getWatch32MoviesList(watch32MoviesUrl.concat(i, '.html'), i, function(moviesList){
    watch32MovieList.push.apply(watch32MovieList, moviesList);
  });
  i++;
  if(i >= 1){
    clearInterval(watch32SleepTimer);
    fs.writeFile('Watch32MoviePages/moviesList.json', JSON.stringify(watch32MovieList, null, 4), function(err){

        console.log('Watch32MoviePages  successfully written! - Check your --Watch32MoviePages-- directory for the .json file');

    })
  }
};

//handle fmovies request call
app.get('/getFMoviesList', function(req, res) {

  res.setTimeout(600000, function(){
        console.log('FMovies Request has timed out.');
            res.send(408);
        });

  //initialize firebase for this app
  firebaseSetup.initializeFirebase();


  fMoviesSleepTimer = setInterval(getFMoviesList, 5000);

});

//handle 123movies request call
app.get('/get123MoviesList', function(req, res) {

  res.setTimeout(600000, function(){
        console.log('123Movies Request has timed out.');
            res.send(408);
        });

  //initialize firebase for this app
  firebaseSetup.initializeFirebase();

  _123MoviesSleepTimer = setInterval(get123MoviesList, 60000);

});

//retrieve fmovies video urls
app.get('/getFMoviesVideos', function(req, res) {

  res.setTimeout(600000, function(){
        console.log('FMovies Videos Request has timed out.');
            res.send(408);
        });

  setTimeout(getFMoviesVideosUrl, 1000);
  //fMoviesSleepTimer = setInterval(getFMoviesVideosUrl, 300000);

});

//handle Watch32 request call
app.get('/getWatch32MoviesList', function(req, res) {

  res.setTimeout(600000, function(){
        console.log('Watch32 Request has timed out.');
            res.send(408);
        });



  watch32SleepTimer = setInterval(getWatch32MoviesList, 5000);

});


app.listen(8081);
console.log('Server is listening to port 8081');



exports = module.exports = app;
