//function to retrieve list of companies for given industry
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var rp = require('request-promise');
var fs = require('fs');

var selectors = require('../resources/selectors');
var urls = require('../resources/urls');
var movieDetailsInstance = require('./getMovieDetails');
var videoUrlInstance =  require('./getVideoUrl');
var queueMovieList = require('./queue');

var sleep = function (milliseconds) {
  var start = new Date().getTime();
  while(true){
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


module.exports = {
   getFMoviesList: function (moviesPageUrl, moviePageNumber, returnCall) {

     rp({
       url: moviesPageUrl,
       method: 'get',
       timeout: 600000
        })
       .then(function (html){

         var moviesList = [], movieDetailsList = [], videoUrlList = [];
         var movieItem, moviesCount = 0;
         //load html contents in jquery selector via cheerio;
         var $ = cheerio.load(html);
         console.log('outside Fmovies list for page - ' + moviePageNumber);
         $(selectors.FMOVIES_PAGE.MOVIES_LIST).each(function(i, elem) {
             movieItem = { movieName: "", movieUrl: urls.FMOVIES.BASE_URL};

             var movieName = $(this).first().find(selectors.FMOVIES_PAGE.MOVIE_LINK).first().text().trim();
             var movieUrl = $(this).first().find(selectors.FMOVIES_PAGE.MOVIE_LINK).first().attr('href').trim();

             if(movieName != undefined && movieUrl != undefined){
                 movieItem.movieName = movieName;
                 movieItem.movieUrl += movieUrl;
             }

             if(movieItem.movieName != "" && movieItem.movieUrl != ""){
                 moviesList.push(movieItem);
                 moviesCount ++;
             }

           });

           if(moviesList.length > 0) {


             queueMovieList(moviesList,
                            1,
                            function(movieItem, callback){
                                movieDetailsInstance.getFMoviesDetails(movieItem.movieUrl, movieItem.movieName, function(movieDetailsItem){
                                    debugger;
                                    movieDetailsList.push.apply(movieDetailsList, movieDetailsItem);

                                    if(moviesList.length == movieDetailsList.length){
                                      //return value in callback function
                                      console.log("All movies of moviePageNumber - " + moviePageNumber + " are processed.");
                                      return returnCall(movieDetailsList);
                                    }
                                    //this movieItem is processed
                                    sleep(3000, callback);
                                 });
                                },
                            function(){
                              console.log("movieList with " + moviesList.length + " items are pushed to process.");
                            });




             /*fs.writeFile('fmovieVideos/'+ moviePageNumber + '-videoUrl.json', JSON.stringify(videoUrlList, null, 4), function(err){

                  console.log('FMovies Page ' + moviePageNumber +' successfully written! - Check your --moviePages-- directory for the .json file');

              })*/
           }
           else {
             console.error("FMovies list is empty. Please check the movie list selectors and try again!!");
           }
       })
       .catch(function (err) {
       console.error('Error occured while requesting url - ' + moviesPageUrl);
       console.error(err);
       return;
     });

  },

  get123MoviesList: function (moviesPageUrl, moviePageNumber) {

    rp({
      url: moviesPageUrl,
      method: 'get',
      timeout: 600000
       })
      .then(function (html){

        var moviesList = [];
        var movieItem, moviesCount = 0;
        //load html contents in jquery selector via cheerio;
        var $ = cheerio.load(html);
        console.log('outside 123movies list for page - ' + moviePageNumber);
        $(selectors._123MOVIES_PAGE.MOVIES_LIST).each(function(i, elem) {
            movieItem = { movieName: "", movieUrl: ""};

            debugger;
            var movieName = $(this).first().find(selectors._123MOVIES_PAGE.MOVIE_NAME).first().text().trim();
            var movieUrl = $(this).first().find(selectors._123MOVIES_PAGE.MOVIE_LINK).first().attr('href').trim();

            if(movieName != undefined && movieUrl != undefined){
                movieItem.movieName = movieName;
                movieItem.movieUrl = movieUrl;
            }

            if(movieItem.movieName != "" && movieItem.movieUrl != ""){
                moviesList.push(movieItem);
                moviesCount ++;
            }

          });

          if(moviesList.length > 0) {

           // companyOverviewInstance.getCompanyOverview(companyList[0].link, companyList[0].company, industryName);


           /* for(company in companyList){

              companyOverviewInstance.getCompanyOverview(companyList[company].link, companyList[company].company, industryName);
            } */


            fs.writeFile('123moviePages/'+ moviePageNumber + '-'+ moviesCount +'.json', JSON.stringify(moviesList, null, 4), function(err){

                console.log('123Movies Page ' + moviePageNumber +' successfully written! - Check your --moviePages-- directory for the .json file');

            })
          }
          else {
            console.error("123Movies list is empty. Please check the movie list selectors and try again!!");
          }
      })
      .catch(function (err) {
      console.error('Error occured while requesting url - ' + moviesPageUrl);
      console.error(err);
      return;
    });

 },

 getWatch32MoviesList : function (moviesPageUrl, moviePageNumber, callback) {

   //parse HTML page and retrieve movie details
   var parseMovies =  function($, returnCall){
     var moviesList = [];
     $(selectors.WATCH32.MOVIES_LIST).each(function(i, elem) {
          movieItem = { movieName: "", movieUrl: "", page: moviePageNumber};
          debugger;

          var movieName = $(this).first().find(selectors.WATCH32.MOVIE_NAME).first().attr('onmouseover').split('<b>')[1].split('</b>')[0];
          var movieUrl = $(this).first().find(selectors.WATCH32.MOVIE_NAME).first().attr('href').trim();

          if(movieName != undefined && movieUrl != undefined){
              movieItem.movieName = movieName;
              movieItem.movieUrl = movieUrl;
          }

          if(movieItem.movieName != "" && movieItem.movieUrl != ""){
              moviesList.push(movieItem);
          }

          return returnCall(moviesList);
        });
    }

  //request movies details from movie page url
   rp({
     url: moviesPageUrl,
     method: 'get',
     timeout: 600000
      })
     .then(function (html){
       console.log("Movies url - " + moviesPageUrl);
       var movieItem, moviesCount = 0;
       sleep(3000);
       //load html contents in jquery selector via cheerio;
       var $ = cheerio.load(html);
       console.log('outside watch32 list for page - ' + moviePageNumber);
       debugger;
        var moviesArray = [];
        parseMovies($, function(list){
          moviesArray = list.splice();
        });

         if(moviesArray.length > 0) {

           return callback(moviesArray);
         }
         else {
           parseMovies($);
           console.error("Watch32 Movies list is empty. Retrying again!!");
         }
     })
     .catch(function (err) {
     console.error('Error occured while requesting url - ' + moviesPageUrl);
     console.error(err);
     return;
   });
}
}
