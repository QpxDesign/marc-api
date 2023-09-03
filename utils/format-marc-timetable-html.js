function format(html) {
  function sterilizeOutputs(text) {
    return text.replaceAll("\t", "").replaceAll("\n", "").replaceAll("\r", "");
  }
  try {
    const TABLE_ROWS = html.querySelectorAll("tbody tr");
    var TRAIN_NAMES = html.querySelectorAll("thead tr th");
    TRAIN_NAMES.shift();
    var final_ans = [];
    TABLE_ROWS.forEach((row) => {
      const stop_name = row.querySelector("th div").innerHTML;

      const stops_body = row.querySelectorAll("td div");
      var ans = {
        stop_name: stop_name,
        trains: [],
        times: [],
      };
      stops_body.forEach((sp, index) => {
        var train_name = TRAIN_NAMES[index].querySelector("div");
        ans.trains.push(sterilizeOutputs(train_name.textContent));
        ans.times.push(sterilizeOutputs(sp.innerHTML));
      });
      final_ans.push(ans);
    });
    return final_ans;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
module.exports = format;
