// scrapper import
const { scraper } = require("./scraper.js")

// essentials imports
const express = require("express");
const fs = require("fs");
var cors = require("cors");
require("dotenv").config()

//Caching
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// To scrape data from the link and store it
// this will scrape the website and save the data
scraper();

//express webserver
const app = express();
app.use(cors());
app.use(express.json());

// root url. it will return all the data
// it has caching for 180 ttl
app.get("/", (req, res) => {
  if (myCache.has("full-data")) {
    res.status(200).send(JSON.parse(myCache.get("full-data")));
  } else {
    fs.readFile("data.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("read file for full data");

      myCache.set("full-data", data, 180);
      res.status(200).send(JSON.parse(data));
    });
  }
});

// this will give list of moves associated with the particular code
// it has caching for ttl 180 seconds too
app.get("/:code", (req, res) => {
  if (myCache.has(req.params.code.toUpperCase())) {
    res.status(200).send(myCache.get(req.params.code.toUpperCase()));
  } else {
    fs.readFile("data.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(data[0])
      console.log(`file read for ${req.params.code.toUpperCase()}`);
      let parsedData = JSON.parse(data);
      sendData = {
        msg: "Code Not Found",
      };
      parsedData.map((i) => {
        if (i.code == req.params.code.toUpperCase()) {
          // sendData = { data: i.value}
          myCache.set(req.params.code.toUpperCase(), i.value, 180);
          sendData = i.value;
        }
      });

      res.status(200).send(sendData);
    });
  }
});

//Chess Bot code
//incomplete code for the advnaced section of the question where a chess bot needs to be implemeted
app.get('/bot/:code/', (req, res) => {
    // console.log(req.params.code)

    fs.readFile("data.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let parsedData = JSON.parse(data);
      sendData = {
        msg: "Code Not Found",
      };
      parsedData.map((i) => {
        if (i.code == req.params.code.toUpperCase()) {
          sendData = i.value.split("\n")[1];
        }
      });

      res.status(200).send(sendData);
    });
})

app.listen(process.env.PORT, console.log(`Server is running on: http://localhost:3000`));
