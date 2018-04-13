var schedule = require('node-schedule');
var volatilityStandouts = require('./utils/volatilityStandouts'); // util functions

if (process.env.NODE_ENV === 'production') {
  // production - job to get our volatility data runs every day after the after hours trading closes
  var j = schedule.scheduleJob('30 23 * * *', function(){
    getVolatilityData();
  });
} else {
  // development - run the util jobs immediately (create new JSON and MP3 files and put them on chrisfrew.in)
  //volatilityStandouts.getVolatilityData; // bunch of NLP ML stuff to build the text (for now is just hardcoded) should be async, THEN we call the following two functions (which can be run in parallel) :
  volatilityStandouts.publishJSON();
  volatilityStandouts.publishMP3();
}
