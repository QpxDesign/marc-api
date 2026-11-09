const fs = require("fs");

let stop_data;
const path = `${__dirname}`.substring(0, `${__dirname}`.lastIndexOf("/"));

fs.readFile(`${path}` + "/assets/stop_times.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  }
  stop_data = data;
});

var express = require("express");
var router = express.Router();

// /getTrainSchedule?trip_id=
router.get("/", function (req, res, next) {
  const trip_id = req.query.trip_id;
  var filtered = [];

  for (line of stop_data.split("\n")) {
    let fields = line.split(",");
    if (fields[0] === trip_id) {
      filtered.push(line);
    }
  }

  var out = [];
  for (line of filtered) {
    let fields = line.split(",");
    var r = {
      is_static: true,
      departure: {
        delay: 0,
        time: fields[2],
      },
      arrival: {
        delay: 0,
        time: fields[1],
      },
      stopId: fields[3],
    };
    out.push(r);
  }
  res.send(out);
});

module.exports = router;
