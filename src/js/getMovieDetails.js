//function to retrieve list of companies for given industry
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var rp = require('request-promise');
var fs = require('fs');
var encodeUri = require('strict-uri-encode');


var selectors = require('../resources/selectors');
var urls = require('../resources/urls');

var movieItem = {
            name: "",
            year: "",
            genre: [],
            imdb : "",
            cast: [],
            director: [],
            country: "",
            quality: "",
            plot: "",
            icon: "",
            playtime: "",
            servers: [],
            trailer: ""
}



var getTrailerUrl = function (movieName, callback){
    
              var youtubeUrl =  urls.YOUTUBE_BASE_URL.concat(urls.YOUTUBE_SEARCH_QUERY, encodeUri(movieName + ' trailer'));
              console.log('Youtube encode url - ' + youtubeUrl);
              rp({
                url: youtubeUrl,
                method: 'get',
                timeout: 600000
                 })
                .then(function (html){
                  //load html contents in jquery selector via cheerio;
                  var $ = cheerio.load(html);

                  var trailerUrl = $(selectors.YOUTUBE_TRAILER).first().attr('href');

                  if(trailerUrl != undefined){
                    return callback(trailerUrl);
                  }
                })
                .catch(function (err) {
                console.error('Error occured while requesting trailer url - ' + youtubeUrl);
                console.error(err);
                return;
              });
            };

module.exports = {

   getFMoviesDetails: function (movieUrl, movieName, callback) {

     rp({
       url: movieUrl,
       method: 'get',
       timeout: 600000
        })
       .then(function (html){

         //load html contents in jquery selector via cheerio;
         var $ = cheerio.load(html);
         console.log('outside Fmovies for movie - ' + movieName);

         movieItem.name = movieName;
         movieItem.genre = $(selectors.FMOVIES_MOVIE_PAGE.GENRE).text().trim().split(',');
         movieItem.cast = $(selectors.FMOVIES_MOVIE_PAGE.CAST).text().trim().split(',');
         movieItem.director = $(selectors.FMOVIES_MOVIE_PAGE.DIRECTOR).text().trim().split(',');
         movieItem.country = $(selectors.FMOVIES_MOVIE_PAGE.COUNTRY).text().trim().split(',');
         movieItem.imdb = $(selectors.FMOVIES_MOVIE_PAGE.IMDB).text().trim();
         movieItem.quality = $(selectors.FMOVIES_MOVIE_PAGE.QUALITY).text().trim();
         movieItem.year = $(selectors.FMOVIES_MOVIE_PAGE.YEAR).text().trim().split('-')[0];
         movieItem.playtime = $(selectors.FMOVIES_MOVIE_PAGE.PLAYTIME).text().trim();
         movieItem.icon = $(selectors.FMOVIES_MOVIE_PAGE.MOVIE_ICON).attr('src');
         movieItem.trailer = $(selectors.FMOVIES_MOVIE_PAGE.TRAILER).attr('data-url');

         if(movieItem.trailer == ("" || undefined)){
           console.log("Trailer doesn't exist");
           getTrailerUrl(movieName, function(trailerUrl){
             movieItem.trailer = urls.YOUTUBE_BASE_URL.concat(trailerUrl);
             console.log("aha !! Found trailer url for movie " + movieName + " from youtube - " + movieItem.trailer);
           })
         }

         movieItem.plot =  $(selectors.FMOVIES_MOVIE_PAGE.SMALL_PLOT).text();

         if(movieItem.plot == ("" || undefined)){
           movieItem.plot =  $(selectors.FMOVIES_MOVIE_PAGE.FULL_PLOT).text().trim();
         }

         //var videoList = [];
        /* $(selectors.FMOVIES_MOVIE_PAGE.SERVER_LIST).each(function(i, elem) {
           debugger;
           var pageurl = $(this).first().find('div > ul > li > a').attr('href').trim();
           getVideoList(urls.FMOVIES.BASE_URL + pageurl, function(videoUrl){
             videoList.push(videoUrl);
           })
         }); */

        var movieDetailsList = [];
        movieDetailsList.push(movieItem);
        return callback(movieDetailsList);

             /*fs.writeFile('fmoviePages/'+ moviePageNumber + '-'+ moviesCount +'.json', JSON.stringify(moviesList, null, 4), function(err){

                 console.log('FMovies Page ' + moviePageNumber +' successfully written! - Check your --moviePages-- directory for the .json file');

             })*/

       })
       .catch(function (err) {
       console.error('Error occured while requesting url - ' + movieUrl);
       console.error(err);
       return;
     });

  }


}
