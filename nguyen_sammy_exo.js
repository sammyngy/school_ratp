let schedulesContainer = document.querySelector(".schedules");
let listStations = document.querySelector(".listStations");
let listSchedules = document.querySelector(".listSchedules");
let trafficStatus = document.querySelector(".trafficStatus");

let apiRequest = (function () {
  async function getApi(url) {
    const res = await fetch(url);
    return res.json();
  }

  return {
    getApi: getApi,
  };
})();

let results = apiRequest.getApi(
  "https://api-ratp.pierre-grimaud.fr/v4/lines/metros"
);

results.then(function (data) {
  let list = "<select id='mySelect' onchange='getStations()'>";
  data.result.metros.forEach((line) => {
    list += "<option value='" + line.code + "'>" + line.name + "</option>";
  });
  list += "</select>";
  schedulesContainer.innerHTML += list;
});

function getStations() {
  var line = document.getElementById("mySelect").value;
  let results = apiRequest.getApi(
    "https://api-ratp.pierre-grimaud.fr/v4/stations/metros/" + line
  );

  document.querySelector(".listStations").innerHTML = "";
  document.querySelector(".listSchedules").innerHTML = " ";

  results.then(function (data) {
    let list2 = "<select id='mySelect2' onchange='getSchedules(" + line + ")'>";

    data.result.stations.forEach(function (line) {
      list2 += "<option value='" + line.slug + "'>" + line.name + "</option>";
    });
    list2 += "</select>";
    listStations.innerHTML += list2;
  });
}

setInterval(function () {
  getSchedules();
}, 30000);

function getSchedules() {
  var station = document.getElementById("mySelect2").value;
  var line = document.getElementById("mySelect").value;

  let results = apiRequest.getApi(
    "https://api-ratp.pierre-grimaud.fr/v4/schedules/metros/" +
      line +
      "/" +
      station +
      "/A"
  );

  document.querySelector(".listSchedules").innerHTML = " ";
  document.querySelector(".trafficStatus").innerHTML = " ";

  results.then(function (data) {
    let schedules = "<ul>";
    data.result.schedules.forEach(function (schedule) {
      const min = parseInt(schedule.message.replace("mn", ""));
      const d = new Date();
      d.setMinutes(d.getMinutes() + min);
      schedules +=
        "<li> Metro dans : " + d.toLocaleTimeString("fr-FR") + "</li>";
    });
    schedules += "</ul>";
    listSchedules.innerHTML += schedules;
  });
  getTrafficStatus();
}

function getTrafficStatus() {
  var line = document.getElementById("mySelect").value;

  let results = apiRequest.getApi(
    "https://api-ratp.pierre-grimaud.fr/v4/traffic/metros/" + line
  );

  results.then(function (data) {
    let message = "<p>" + data.result.message + "</p>";
    trafficStatus.innerHTML += message;
  });
}
