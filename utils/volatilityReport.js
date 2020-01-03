const uuidv4 = require('uuid/v4');
var txtomp3 = require("text-to-mp3");
var shell = require('shelljs');
var fs = require('fs');
var axios = require('axios');
var lame = require('lame');
var Speaker = require('speaker');
var moment = require('moment');
const sMP3FileName = 'feed.mp3';
const chapter1 = require('./chapter1').chapter1;
const chapter2 = require('./chapter2').chapter2;
const chapter3 = require('./chapter3').chapter3;
let sTextToSpeach = ""; // global string to fill from multiple async "chapter" functions
let sRelativeFilePath;

if (process.env.NODE_ENV === 'production') {
  sRelativeFilePath = "../chrisfrew.in-static/public/volatility-standouts/"; // production - note the trailing slash should be present!
} else {
  sRelativeFilePath = "./test-output/"; // local path for testing output files (conveniently called 'test-output') ;)
}

// generates the preamble of the report before the chapters
function preamble() {
  sTime = moment().format('h mm a');
  sHour = sTime.split(" ")[0];
  sMinute = sTime.split(" ")[1]
  sPeriod = sTime.split(" ")[2].toUpperCase(); // convert to upper case for robo-reading :)
  return "Good evening Chris, the markets in the U.S. have just closed. It is " + moment().format('dddd') + ", " +  moment().format('MMMM Do YYYY') + " " + sHour + " " + sMinute + " " + sPeriod + ". This... is today's Volatility Report. Enjoy. ";
}

async function buildVolatilityReport() {
  var sPreamble = preamble();
  var sChapter1String = await chapter1(); // chapter 1: reports
  var sChapter2String = await chapter2(); // chapter 2: index options most active
  var sChapter3String = await chapter3(); // chapter 3: market snapshot and market pulse
  sTextToSpeach = sPreamble + sChapter1String + sChapter2String + sChapter3String;
  sTextToSpeach = sTextToSpeach + " This concludes the volatility summary.";
  publishMP3(); // this and the alexa can be run at the same time, they are independant
  publishAlexaJSON();
}

function publishAlexaJSON() {
// saved as desired JSON type that alexa platform expects
//   {
//   "uid": "urn:uuid:1335c695-cfb8-4ebb-abbd-80da344efa6b",
//   "updateDate": "2016-05-23T22:34:51.0Z",
//   "titleText": "Amazon Developer Blog, week in review May 23rd",
//   "mainText": "",
//   "streamUrl": "https://developer.amazon.com/public/community/blog/myaudiofile.mp3",
//   "redirectionUrl": "https://developer.amazon.com/public/community/blog" (only if you want a link for "read more")
// }

  // JSON file
  var oJavaScriptObj = {
    "uid": uuidv4(),
    "updateDate": new Date().toISOString(),
    "titleText": "Volatility Standouts Report at close of afterhours trading - " + new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
    "mainText": sTextToSpeach,
    "streamUrl": "https://chrisfrew.in/public/volatility-standouts/feed.mp3"
  }
  var oJSON = JSON.stringify(oJavaScriptObj); // convert javascript object to JSON
  fs.writeFile(sRelativeFilePath + 'feed.json', oJSON, 'utf8', function(err) {
      if(err) {
          return console.log(err);
      }
      if (process.env.NODE_ENV === 'production') {
        console.log("JSON file for Alexa saved! Should be reachable live at https://chrisfrew.in/public/volatility-standouts/feed.json");
      } else {
        console.log("JSON file for Alexa saved! Should be saved at " + sRelativeFilePath + "feed.json");
      }
  });
}

function publishMP3() {
  // minimum require interface for google text to speech
  const oData = {
    "input":
    {
      "text": sTextToSpeach
    },
    "voice":
    {
      "languageCode": "en-GB",
      "ssmlGender": "FEMALE"
    },
    "audioConfig":
    {
      "audioEncoding": "mp3"
    }
  };
  axios.post("https://texttospeech.googleapis.com/v1beta1/text:synthesize?fields=audioContent&key=" + process.env.GOOGLE_CLOUD_TEXT_TO_SPEECH_API, oData)
  .then(function (oResponse) {
    // write dat baoss (an encoded string) response into an mp3 file
    fs.writeFileSync(sRelativeFilePath + sMP3FileName, oResponse.data.audioContent, 'base64', function(err) { // write this base64 to an mp3
      console.log(err);
    });
    if (process.env.NODE_ENV === 'production') {
      console.log("MP3 file for Alexa successfully generated and saved! Should be reachable live at https://chrisfrew.in/public/volatility-standouts/feed.mp3");
    } else {
      console.log("MP3 file for Alexa successfully generated and saved! Should be saved at " + sRelativeFilePath + "feed.mp3");
      console.log("Here is the text and a sample playback, (though not alexas voice):");
      console.log(sTextToSpeach);
      fs.createReadStream(sRelativeFilePath + sMP3FileName)
        .pipe(new lame.Decoder())
        .on('format', function (format) {
          this.pipe(new Speaker(format));
        });
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

exports.buildVolatilityReport = buildVolatilityReport;
