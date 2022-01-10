const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
require("dotenv").config()

outerobj = [];
//this will scrape the link and write the data into a file (substitute for a dbms)
function scraper() {
  request(process.env.SCRAPE_URL, (e, r, h) => {
    if (!e && r.statusCode == 200) {
      const $ = cheerio.load(h);
      let datalist = [];

      $("tr").each((i, data) => {
        datalist.push($(data).text());
      });
      datalist.map((item) => {
        let cod = item.substring(0, 3).toString();
        let opp = item.substring(3);
        innerobj = { code: cod, value: opp };
        outerobj.push(innerobj);
      })      
    }

    fs.writeFile("data.txt", JSON.stringify(outerobj), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file written successfully
      console.log("Written Successfully");
    });
  });
}

module.exports = {scraper}