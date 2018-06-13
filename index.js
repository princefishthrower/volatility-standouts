var schedule = require('node-schedule');
var volatilityReport = require('./utils/volatilityReport'); // util functions
var moment = require("moment-holiday");
var say = require('say');

if (process.env.NODE_ENV === 'production') {
  // production - job to get our volatility data runs every day after the after hours trading closes (currently near market close)
  var j = schedule.scheduleJob('30 21 * * 1-5', function() {
    checkForHoliday(); // we are on a week day and it is not a federal holiday, create the report!
  });
} else {
  // development - run the util jobs immediately (create new JSON and MP3 files and put them on chrisfrew.in)
  //volatilityReport.getVolatilityData; // bunch of NLP ML stuff to build the text (for now is just hardcoded) should be async, THEN we call the following two functions (which can be run in parallel) :
  checkForHoliday();
}

function checkForHoliday() {
  var oDate = new Date("2017-11-22");
  var sDate = moment(oDate).isHoliday();
  if (sDate === "New Year's Day" || 
      sDate === "Martin Luther King Jr. Day" || 
      sDate === "Good Friday" || 
      sDate === "Memorial Day" || 
      sDate === "Independence Day" || 
      sDate === "Labor Day" || 
      sDate === "Thanksgiving Day" ||
      sDate === "Christmas Day") {
    say.speak("Today is " +  sDate  + ", and the markets are closed, therefore no report was generated.");
  } else {
    volatilityReport.buildVolatilityReport();
  }
}