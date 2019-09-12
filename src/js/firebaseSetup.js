//this module contains firebase related setup and read/write code
var firebaseInstance = require('firebase');

module.exports = {
  firebase: firebaseInstance,
  config: {
      apiKey: "AIzaSyAbFSXBI10xprdTfT3lAWZ1TKAnL1v7gX0",
      authDomain: "stockplay-679d7.firebaseapp.com",
      databaseURL: "https://stockplay-679d7.firebaseio.com",
      storageBucket: "stockplay-679d7.appspot.com",
      messagingSenderId: "315615241903"
  },
  initializeFirebase: function(){
    // Initialize Firebase
    firebaseInstance.initializeApp(this.config);
  },
  writeCompanyOverviewDataInFirebase: function(companyOverviewData) {
      firebaseInstance.database().ref('overviewConsolidated/' + companyOverviewData.bseCode).set({
      bseCode: companyOverviewData.bseCode,
      industry: companyOverviewData.industry,
      marketCap: companyOverviewData.marketCap,
      peRatio: companyOverviewData.peRatio,
      bookValue: companyOverviewData.bookValue,
      dividend: companyOverviewData.dividend,
      industryPE: companyOverviewData.industryPE,
      epsTTM: companyOverviewData.epsTTM,
      pcRatio: companyOverviewData.pcRatio,
      pbRatio: companyOverviewData.pbRatio,
      dividendYield: companyOverviewData.dividendYield,
      faceValue: companyOverviewData.faceValue,
      deliverables: companyOverviewData.deliverables,
      sentiment: '50/40/10',
      bse52Low: companyOverviewData.bse52Low,
      bse52High: companyOverviewData.bse52High
    });
  }

}
