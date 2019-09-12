//this file contains various urls to scrape
module.exports = {
  PHANTOMPATH: 'C:/phantomjs/phantomjs',
  YOUTUBE_BASE_URL: 'https://youtube.com',
  YOUTUBE_SEARCH_QUERY: '/results?search_query=',
  FMOVIES: {
    BASE_URL: 'http://fmovies.to',
    MOVIES_PAGE_RELATIVE_URL: '/movies?page=',
    MOVIESLIST_JSON_PATH: './fmoviePages/'
  },
  _123MOVIES:{
    BASE_URL: 'http://123movies.is',
    MOVIES_PAGE_RELATIVE_URL: '/movie/filter/movie/latest/all/all/all/all/all/'
  },
  WATCH32: {
    BASE_URL: 'http://watch32.is',
    MOVIES_PAGE_RELATIVE_URL: '/cinema-movies/page-',
    MOVIESLIST_JSON_PATH: './Watch32MoviePages/'
  }
}
