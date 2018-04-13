const uuidv4 = require('uuid/v4');
const say = require('say');
var shell = require('shelljs');

const sMainText = "Markets closed higher across the board today while fears of weaponized response in syria waned. Shares of VIX were trading about 4% lower today, from a drop of near highs of $40.00 to $38.64. Standout stock volatilities include FB (Facebook) at a 90% 52 week percentile, and JPM (J.P. Morgan Chase) at an 88% percentile. The general sentiment found at market close for volatility is a continuing trend downward. As of 5 PM Eastern Time, volatility futures were trading lower.";
let sRelativeFilePath;
if (process.env.NODE_ENV === 'production') {
  sRelativeFilePath = "../chrisfrew.in-static/public/volatility-standouts/"; // production - note the trailing slash should be present!
} else {
  sRelativeFilePath = "./test/"; // local path for testing
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
    "streamUrl": "https://chrisfrew.in/public/volatility-standouts/report.mp3"
  }
  var oJSON = JSON.stringify(oJavaScriptObj); // convert javascript object to JSON
  fs.writeFile(sRelativeFilePath + 'report.json', json, 'utf8', function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("JSON file for Alexa saved! Should be reachable on https://chrisfrew.in/public/volatility-standouts/report.json");
  }); 
}

function publishMP3() {
  // Export spoken audio to a WAV file for now, just write an mp3 with the 'say' library - voice quality won't be that great, but it will be very simple
  say.export(sMainText, 'Samantha', 1.00, sRelativeFilePath + 'report.wav', (err) => {
    if (err) {
      return console.error(err)
    }
    console.log('Audio file for Alexa saved.');
    
    // convert .wav to .mp3 with ffmp3g
    if (shell.exec('ffmpeg -i '+ sRelativeFilePath + 'report.wav acodec mp3 '+ sRelativeFilePath + 'report.mp3').code !== 0) {
      shell.echo('.wav conversion to .mp3 failed!');
      shell.exit(1);
    } else {
      shell.echo('.wav conversion to .mp3 successful!');
    }
    
    // remove .wav
    if (shell.exec('rm '+ sRelativeFilePath + 'report.wav').code !== 0) {
      shell.echo('.wav file could not be removed!');
      shell.exit(1);
    } else {
      shell.echo('.wav file removed successfully!');
    }
  });
}

// in the future, this will do smart stuff and populate the variable 'sMainText'
function getVolatilityData() {
    // const oTextToSpeechObj = {
    //   "input": {
    //      "text": sMainText,
    //   },
    //    "voice": {
    //      "languageCode": "en-US",
    //      "name": "en-US-Wavenet-F"
    //   },
    //    "audioConfig": {
    //      "audioEncoding": "MP3",
    //      "pitch": 0.00,
    //      "speakingRate": 1.00
    //   }
    // }
    
    // 
        
}
exports.publishJSON = publishJSON;
exports.publishMP3 = publishMP3;
exports.getVolatilityData = getVolatilityData;