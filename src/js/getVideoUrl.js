var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

module.exports = {
  getFMoviesVideoUrl : function(webdriver, movieItem, callback){
    var videoUrl = "", currentTabId = "", otherTab = "";
    debugger;
    webdriver
        .url(movieItem.movieUrl)
        .getCurrentTabId()
        .then(function(myTabId){
          console.log("current tab - " + myTabId);
          currentTabId = myTabId;
        })
        .waitForExist('div#player', 10000)
        .click('div#player')
        .pause(3000)
        .getTabIds()
        .then(function(tabIds){
          if(tabIds.length > 1){
            for(var i in tabIds){
              if(tabIds[i] != currentTabId){
                console.log("not my tab - " + tabIds[i]);
                otherTab = tabIds[i];
              }

            }
          }
        })
        .waitForExist('video', 10000)
        .getAttribute('video','src')
        .then(function(src){
            videoUrl = src;
            console.log('Video url for movie ::' + movieItem.movieName + ' is :: ' + src);
            return callback(videoUrl);
        });

        /*.getTabIds()
        .then(function(tabIds){
          if(tabIds.length > 1){
            for(var i in tabIds){
              if(tabIds[i] != currentTabId){
                console.log("not my tab - " + tabIds[i]);
                otherTab = tabIds[i];
              }

            }
          }
        })
        .switchTab(otherTab)*/




  }
}
