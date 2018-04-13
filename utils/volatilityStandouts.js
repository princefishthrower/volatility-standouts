const uuidv4 = require('uuid/v4');
var txtomp3 = require("text-to-mp3");
var shell = require('shelljs');
var fs = require('fs');
var axios = require('axios');

const sMainText = "Markets closed higher across the board today while fears of weaponized response in Syria decreased. Shares of VIX were trading about 4% lower today, from a drop of near highs of $40.00 to $38.64. Standout stock volatilities include FB (Facebook) at a 90% 52 week percentile, and JPM (J.P. Morgan Chase) at an 88% percentile. The general sentiment found at market close for volatility is a continuing pattern of decreasing volatility. As of 6:30 PM Eastern Time, volatility futures were trading lower.";
let sRelativeFilePath;
if (process.env.NODE_ENV === 'production') {
  sRelativeFilePath = "../chrisfrew.in-static/public/volatility-standouts/"; // production - note the trailing slash should be present!
} else {
  sRelativeFilePath = "./test-output/"; // local path for testing output files (conveniently called 'test-output') ;)
}

function publishJSON() {
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
    "mainText": sMainText,
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
  const oData = {
    "input":
    {
      "text": sMainText
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
    fs.writeFileSync(sRelativeFilePath + 'feed.mp3', oResponse.data.audioContent, 'base64', function(err) { // write this base64 to an mp3
      console.log(err);
    });
    if (process.env.NODE_ENV === 'production') {
      console.log("MP3 file for Alexa successfully generated and saved! Should be reachable live at https://chrisfrew.in/public/volatility-standouts/feed.mp3");
    } else {
      console.log("MP3 file for Alexa successfully generated and saved! Should be saved at " + sRelativeFilePath + "feed.mp3");
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

// in the future, this will do smart stuff and populate the variable 'sMainText'
function getVolatilityData() {

}
exports.publishJSON = publishJSON;
exports.publishMP3 = publishMP3;
exports.getVolatilityData = getVolatilityData;
