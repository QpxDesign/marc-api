const fs = require("fs");

let stop_data;
let trip_data;
let calendar_data;
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

function get_direction(trip_id) {
  for (line of trip_data.split("\n")) {
    let fields = line.split(",");
    if (fields[0] === trip_id) {
      return line.split(",")[5];
    }
  }
  return 0;
}

function get_headsign(trip_id) {
  for (line of trip_data.split("\n")) {
    let fields = line.split(",");
    if (fields[0] === trip_id) {
      return line.split(",")[3];
    }
  }
  return "";
}

function get_calendar(trip_id, route_name) {
  // get service_id
  var service_id = "";
  var route_id = 0;
  if (route_name.toLowerCase() === "penn") {
    route_id = "11705";
  } else if (route_name.toLowerCase() === "camden") {
    route_id = "11706";
  } else if (route_name.toLowerCase() == "brunswick") {
    route_id = "11704";
  }

  for (line of trip_data.split("\n")) {
    let fields = line.split(",");
    if (fields[0] === trip_id && fields[1] === route_id) {
      service_id = line.split(",")[2];
      break;
    }
  }
  for (line of calendar_data.split("\n")) {
    let fields = line.split(",");
    if (fields[0] === service_id) {
      return fields.splice(1, 7);
    }
  }
  return [];
}

router.get("/", function (req, res, next) {
  // format: /getTimetableNew?line=penn&day_of_week=[0-7]&direction=[outbound|inbound]&stop_id=[stop_id]
  // weeks start on monday
  var results = [];
  let formatted_direction = req.query.direction === "outbound" ? "0" : "1";

  for (line of stop_data.split("\n")) {
    let fields = line.split(",");
    let cal = get_calendar(fields[0], req.query.line);
    console.log(cal.length);
    if (
      req.query.stop_id.split(",").includes(fields[3]) &&
      req.query.day_of_week < cal.length &&
      cal[req.query.day_of_week] === "1" &&
      "" + get_direction(fields[0]) === formatted_direction
    ) {
      let a = {
        trip_id: fields[0],
        arrival_time: fields[1],
        headsign: get_headsign(fields[0]),
      };
      results.push(a);
    }
  }
  res.send(results);
});

module.exports = router;
