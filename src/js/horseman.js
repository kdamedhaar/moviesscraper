var Horseman = require('node-horseman');
var urls = require('../resources/urls');
var selectors = require('../resources/selectors');
var async = require('async');
var fs =  require('fs');

var phantomInstance = new Horseman({
  phantomPath: urls.PHANTOMPATH,
  loadImages: true,
  injectJquery: true,
  webSecurity: true,
  ignoreSSLErrors: true,
  timeout: 10000
});

var getWatch32MoviesList = function (i, callback){
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

      fs.writeFile('Watch32MoviePages/' + i +'.json', JSON.stringify(movies, null, 4), function(err){

          console.log('Watch32MoviePages  successfully written! - Check your --Watch32MoviePages-- directory for the .json file');
          next = true
          return callback(true);
      })
    })
    .catch(function(err){
      console.log("Error occured - " + err);
    })
    .close();
}

  function getMovies() {
      return phantomInstance.evaluate(function () {
          var movies = [];
          conosle.log("Inside movies....");
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


  function loopThru(l, m){
    var end = false;
    var next = true;
    while(!end){
      if(next){
        next = false;
        console.log("going to get movies for page  - " + l);
        getWatch32MoviesList(l, function(value){
          console.log("finished page - " + l);
          if(value){
            next = true;
            l++;
            console.log("moving to page - " + l);
          }
        });
        if(l > m){
          end = true;
        }
      }
    }
    console.log("Process finished !!");
  }

loopThru(1, 4);
