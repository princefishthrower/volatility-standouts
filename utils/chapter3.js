const axios = require('axios');
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser');
const say = require('say')

module.exports = {
  chapter3: async function() {
    return axios.get("https://research.tdameritrade.com/grid/public/markets/news/news.asp")
      .then(oResponse => parseSite(oResponse.data))
      .catch(err => console.log(err));
      
    function parseSite(oHTML) {
      let sMarketSnapshot, sMarketPulse;
      let sStringToSpeak = ". Chapter 3: From TD Ameritrade - Market Snapshot and Market Pulse. Market Snapshot: ";
      $ = cheerio.load(oHTML); // load the page response into the cheerio html object
      sMarketSnapshot = $(".news-snapshot-section")[0].children[4].children[0].data;
      sMarketPulse = $(".news-snapshot-section")[1].children[4].children[0].data
      sStringToSpeak = sStringToSpeak + " " + sMarketSnapshot + " . Market Pulse: " + sMarketPulse + ". "
      console.log(sStringToSpeak);
      return sStringToSpeak;
    }
  }
}