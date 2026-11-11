var express = require("express");
var router = express.Router();
var GtfsRealtimeBindings = require("gtfs-realtime-bindings");
var request = require("request");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
let test_json = require("../test/mtaAPI/1793986588.json");

router.get("/", function (req, res, next) {
  fetch("https://mdotmta-gtfs-rt.s3.amazonaws.com/MARC+RT/marc-vp.pb")
    .then((r1) => r1.arrayBuffer())
    .then((r2) => new Uint8Array(r2))
    .then((r3) => GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(r3))
    .then((r4) => {
      // const data = test_json; // TESTING
      var data = JSON.parse(JSON.stringify(r4));
      if (data.entity === undefined) {
        res.send(data);
      } else {
        data.entity.forEach((pos) => {
          console.log(pos.vehicle.position.speed);
          pos.vehicle.position.speed *= 2.237;
          console.log(pos.vehicle.position.speed);
        });
        res.send(data);
      }
    });
});

module.exports = router;
