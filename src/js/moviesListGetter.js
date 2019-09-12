var cheerio = require('cheerio');
var async = require('async');
var rp = require('request-promise');
var fs = require('fs');
var Horseman = require('node-horseman');

var selectors = require('../resources/selectors');
var urls = require('../resources/urls');

var totalPages = 1171;

function getMovieList(pages){

  var moviePages = [];
  var i = 1;
  while(i <= pages){
    moviePages.push(i);
    i++;
  }

  console.log("Pages - " + moviePages);
  async.eachLimit(moviePages,1, getWatch32MoviesList,function(err,data) {
    if(!err){
      console.log("ALL DONE....");
    }
    else{
      console.log("Shit!! Error occurred... - " + err);
    }
});
}

var phantomInstance = new Horseman({
  phantomPath: urls.PHANTOMPATH,
  loadImages: true,
  injectJquery: true,
  webSecurity: true,
  ignoreSSLErrors: true,
  timeout: 10000
});

var getWatch32MoviesList = function (i, callback){
  console.log("GETTING LIST FOR PAGE - " + i);
  phantomInstance
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://watch32.is/new-movies/page-' + i +'.html')
    .log("Page opened")
    .on('loadFinished', function (status) {
        console.log("Page loaded with status - " + status);
      })
    .waitForSelector('#contentupdate > div:nth-child(2) > ul > li')
    .log("selector found")
    .then(getMovies)
    .then(function(movies){
      console.log("this movies length - " + movies.length);

      fs.writeFile('Watch32MoviePages/' + (i + 1805) +'.json', JSON.stringify(movies, null, 4), function(err){

          console.log('Watch32MoviePages  successfully written! - Check your --Watch32MoviePages-- directory for the .json file');
          return callback(null);
      })
    })
    .catch(function(err){
      console.log("Error occured - " + err);
      getWatch32MoviesList(i, callback);
    })
}

  function getMovies() {
      return phantomInstance.evaluate(function () {
          var movies = [];
          console.log("Inside movies....");
          $('#contentupdate > div:nth-child(2) > ul > li').each(function (i, el) {
              var movie = {name: "", url: ""};
              movie.name = $(this).first().find('a').first().attr('onmouseover').split('<b>')[1].split('</b>')[0];
              movie.url = $(this).first().find('a').first().attr('href');
              console.log(movie.name + " :: " + movie.url);
              movies.push(movie);
          });
          return movies;
       });
  }

  //call function
  //getMovieList(totalPages);

  var getMovieDetails = function (movie, callback){
    console.log("GETTING LIST FOR PAGE - " + movie.name + " :: " + movie.url);

    var horseman = new Horseman({
      phantomPath: urls.PHANTOMPATH,
      loadImages: true,
      injectJquery: true,
      webSecurity: true,
      ignoreSSLErrors: true,
      timeout: 10000
    });
    horseman
      .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
      .open(movie.url)
      .log("Page opened")
      .on('loadFinished', function (status) {
          console.log("Page loaded with status - " + status);
        })
      .waitForSelector('#total_version')
      .log("selector found")
      .evaluate(function () {
          var servers = [];
          console.log("Inside movies servers function....");
          $('#total_version > div.server_line').each(function (i, el) {
              var server = {name: "", url: ""};
              server.name = $(this).find('p.server_servername').first().text();
              server.url = $(this).find('p.server_version > a').first().attr('href');
              console.log(server.name + " :: " + server.url);
              servers.push(server);
          });
          return servers;
       })
      .then(function(servers){
        console.log("this servers length - " + servers.length);
        movie.url = servers.splice();
        callback(null, movie);

      })
      .catch(function(err){
        console.log("Error occured - " + err);
        getMovieDetails(movie, callback);
      })
      .close();
  }

  function getMovieServers(horseman) {
      return horseman.evaluate(function () {
          var servers = [];
          console.log("Inside movies servers function....");
          $('#total_version > div.server_line').each(function (i, el) {
              var server = {name: "", url: ""};
              server.name = $(this).find('p.server_servername').first().text();
              server.url = $(this).find('p.server_version > a').first().attr('href');
              console.log(server.name + " :: " + server.url);
              servers.push(server);
          });
          return servers;
       });
  }

  function readMovieList(i, callback){

    var file = urls.WATCH32.MOVIESLIST_JSON_PATH.concat(i,'.json');
    var moviesList = JSON.parse(fs.readFileSync(file, 'utf8'));
    var newMovieList = [];
    async.eachLimit(moviesList, 1, getMovieDetails, function(err,newMovieData) {
      if(!err){
        console.log("ALL DONE....");
        newMovieList.push(newMovieData);
        console.log("Movie url - " + newMovieData.url.length);
        fs.writeFile('Watch32NewMoviePages/' + i +'.json', JSON.stringify(newMovieList, null, 4), function(err){

            console.log('newMovieList successfully written! - Check your --Watch32NewMoviePages-- directory for the .json file');
        })

          callback(null);
      }
      else{
        console.log("Shit!! Error occurred... - " + err);
      }
    });


  }

  function letsGetMovieData(){

    var moviePages = [];
    var newMovieList = [];
    var i = 2;
    while(i <= 2){
      moviePages.push(i);
      i++;
    }

    async.eachLimit(moviePages, 1, readMovieList, function(err,newMovieData) {
      if(!err){
        console.log("ALL DONE....");
        newMovieList.push(newMovieData);
      }
      else{
        console.log("Shit!! Error occurred... - " + err);
      }
    });

  }

  letsGetMovieData();
