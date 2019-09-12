//this file contains various paths and selectors to use to scrape data
module.exports = {
  YOUTUBE_TRAILER: 'div#results > ol:nth-child(1) > li:nth-child(2) > ol:nth-child(1) > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h3 > a',
  FMOVIES_PAGE: {
    MOVIES_LIST: '#body-wrapper > div > div:nth-child(1) > div.widget-body > div.row.movie-list > div.col-lg-3.col-md-4.col-sm-6.col-xs1-8.col-xs-12',
    MOVIE_LINK: 'div.item > a.name',
  },
  FMOVIES_MOVIE_PAGE: {
    GENRE: '#info > div > div.info.col-md-19 > div > div.row > dl:nth-child(1) > dd:nth-child(2)',
    CAST: '#info > div > div.info.col-md-19 > div > div.row > dl:nth-child(1) > dd:nth-child(4)',
    DIRECTOR: '#info > div > div.info.col-md-19 > div > div.row > dl:nth-child(1) > dd:nth-child(6)',
    COUNTRY: '#info > div > div.info.col-md-19 > div > div.row > dl:nth-child(1) > dd:nth-child(8)',
    IMDB: '#info > div > div.info.col-md-19 > div > div.meta > span:nth-child(1) > b',
    QUALITY: '#info > div > div.info.col-md-19 > div > div.row > dl:nth-child(2) > dd:nth-child(6)',
    YEAR: '#info > div > div.info.col-md-19 > div > div.row > dl:nth-child(2) > dd:nth-child(4)',
    SMALL_PLOT: 'div.desc',
    FULL_PLOT: 'div.fullcontent',
    SERVER_LIST: '#servers > div.server.row',
    TRAILER: '#control > div.item.mbtn.watch-trailer.hidden-xs',
    VIDEO: 'video',
    MOVIE_ICON: '#info > div > div.thumb.col-md-5.hidden-sm.hidden-xs > img',
    PLAYTIME: '#info > div > div.info.col-md-19 > div > div.meta > span:nth-child(2) > b'
  },
  _123MOVIES_PAGE: {
    MOVIES_LIST: '#main > div > div.main-content.main-category > div.movies-list-wrap.mlw-category > div.movies-list.movies-list-full > div.ml-item',
    MOVIE_NAME: 'a > span.mli-info > h2',
    MOVIE_LINK: 'a'
  },
  WATCH32: {
    MOVIES_LIST: '#contentupdate > div:nth-child(2) > ul > li',
    MOVIE_NAME: 'a',
    SERVERS_LIST: '#total_version > div.server_line'

  }
}
