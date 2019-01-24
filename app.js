const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _jsonData = require(__dirname + "/data/data.json");
const _emergencyJsonData = require(__dirname + "/data/emergency.json");

//Variables
let animal = "";
let units = "kgs";
let weight = 0;
let selectionHistory = [];

// Setup Server
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

// EXPRESS ROUTING

app.get("/", function(req, res) {
  res.render("landing");
});

app.post("/category-select", function(req, res){
  let drilledData = {};
  let selected = req.body.selected;
  let page_id = req.body.page_id;
  let backPages = selectionHistory.length - page_id;
  if (backPages > 0) {
    for (i = 0; i < backPages; i++){
      selectionHistory.pop();
    }
  };

  if (page_id === "0") {
    animal = req.body.animal;
    units = req.body.units;
    if (units === "lbs") {
      weight = Number(req.body.weight) * 2.204;
    } else {
      weight = Number(req.body.weight);
    }
    selectionHistory.push(selected);
    drilledData = selectDataSource(selected);
  } else {
    selectionHistory.push(selected);
    drilledData = drillDown(selectionHistory);
  }
  if (page_id === "2") {
    page_id++;
    res.render("drug-list", {data: drugsByAnimal(drilledData)});

  } else {
    let passData = [];
    for (element in drilledData ) {
      passData.push(element);
    }

    page_id++;
    pageSubmitted = page_id;

    res.render("category", {
        data: passData,
        page_id: page_id
    });
  }
});
// Functions

const drillDown = (history) => {
  let _history = history.slice(0);
  let _data = selectDataSource(_history.shift());
  _history.forEach((e) => {
    _data = _data[e];
  });
  return _data;
}

const selectDataSource = (selected) => {
  let _dataSource = {};
  switch (selected) {
    case "EMERGENCY":
      _dataSource = _emergencyJsonData;
      break;
    default:
    _dataSource = _jsonData;
  }
  return _dataSource;
}

const drugsByAnimal = (dataArray) => {
  let drugData = {};

  for (e in dataArray) {
    drug = {};
    if (dataArray[e][animal + "Label"]) {
      drug.Label = dataArray[e][animal + "Label"];
    }
    if (dataArray[e][animal + "NLabel"]) {
      drug.NLabel = dataArray[e][animal + "NLabel"];
    }
    drugData[e] = drug;
  };

  let passData = {
    animal: animal,
    weight: weight,
    units: units,
    drugs: drugData
  }
  return passData;
}
