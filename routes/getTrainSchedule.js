const fs = require("fs");

let stop_data;
let calendar_data;
let trip_data;

const path = `${__dirname}`.substring(0, `${__dirname}`.lastIndexOf("/"));

fs.readFile(`${path}` + "/assets/stop_times.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  }
  stop_data = data;
});

fs.readFile(`${path}` + "/assets/calendar.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  }
  calendar_data = data;
});

fs.readFile(`${path}` + "/assets/trips.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  }
  trip_data = data;
});

var express = require("express");
var router = express.Router();

function get_calendar(trip_id) {
  var service_id = "";
  for (line of trip_data.split("\n")) {
    if (line.split(",")[0] === trip_id) {
      service_id = line.split(",")[2];
      break;
    }
  }
  for (line of calendar_data.split("\n")) {
    let fields = line.split(",");

    if (fields[0] == service_id) {
      return fields.splice(1, 7);
    }
  }
  return [];
}

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
      calendar: get_calendar(trip_id),
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
