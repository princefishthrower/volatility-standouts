const axios = require('axios');
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser');
const say = require('say')

module.exports = {
  chapter2: async function() {
    return axios.get("http://www.cboe.com/data/HHVolumeReportIndex.aspx")
      .then(oResponse => parseTable(oResponse.data))
      .catch(err => console.log(err));
      
    function parseTable(oHTML) {
      let aTableData;
      let sStringToSpeak = ". Chapter 2: From the CBOE - Most Actives and Gainers/Losers for Index Options. ";
      $ = cheerio.load(oHTML); // load the page response into the cheerio html object
      cheerioTableparser($); // also need to pass the whole damn crap to the table parser
      for (var i = 0; i < 4; i++) {
        // first table is most active calls, the most active puts, then gainers, then losers
        switch(i) {
          case 0:
            sStringToSpeak += "The most active call type is: "
            break;
          case 1:
            sStringToSpeak += "The most active put type is: "
            break;
          case 2:
            sStringToSpeak += "Count of call gainers and losers summary is: "
            break;
          case 3:
            sStringToSpeak += "Count of put gainers and losers summary is: "
            break;
        }
        aTableData = $($( "table" )[i]).parsetable(true, true, true); 
        aTableData.forEach((aColumn) => {
          sStringToSpeak += aColumn[0] + " " + aColumn[1] + ", "; // column 0 (header title name) + column 1 (first value) is enough
        });
      }
      console.log(sStringToSpeak);
      return sStringToSpeak;
    }
  }
}