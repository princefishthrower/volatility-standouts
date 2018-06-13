const axios = require('axios');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const say = require('say');

module.exports = {
  chapter1: async function() {
   return axios.get("http://www.cboe.com/data/current-market-statistics/cboe-daily-market-statistics")
     .then(oResponse => parseTable(oResponse.data))
     .catch(err => console.log(err));
     
   function parseTable(oHTML) {
     let aTableData;
     let sStringToSpeak = "Chapter 1: From the CBOE - Open and Close of VIX. ";
     $ = cheerio.load(oHTML); // load the page response into the cheerio html object
     cheerioTableparser($); // also need to pass the whole damn crap to the table parser
     aTableData = $($( "table" )[6]).parsetable(true, true, true); 
     aTableData.forEach((aColumn,iIndex) => {
        if (aColumn[0].substr(0,6) === "VIX - ") {
          sStringToSpeak += aTableData[iIndex+4] + ": $" + aTableData[iIndex+8] + ", "; // column 4 (header title name) + column 4+4 (first value) is enough
        }
      });
     console.log(sStringToSpeak);
     return sStringToSpeak;
   }
  }
}