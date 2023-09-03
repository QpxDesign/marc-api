const html_parser = require("node-html-parser");
const HtmlTableToJson = require("html-table-to-json");
const formatMarcTimetableHTML = require("../utils/format-marc-timetable-html");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // format: /getTimetable?line=penn&date=09%2F02%2F2023&direction=outbound

  fetch(
    `https://www.mta.maryland.gov/schedule/timetable/marc-${
      req.query.line
    }?schedule_date=${req.query.date}&direction=${
      req.query.direction === "outbound" ? "0" : "1"
    }`
  )
    .then((r) => r.text())
    .then((r2) => {
      const a = html_parser.parse(r2);
      const table = a.querySelector(".marctable table");
      if (table === undefined || table === null) {
        res.send({ error: "true", msg: "no trains today" });
      } else {
        const b = formatMarcTimetableHTML(table);
        if (b === undefined) {
          res.send({ error: "true", msg: "could not parse json" });
        } else {
          res.send(b);
        }
      }
    });
});

module.exports = router;
