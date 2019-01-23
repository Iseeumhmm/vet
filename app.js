const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _jsonData = require(__dirname + "/data/data.json");
const _emergencyJsonData = require(__dirname + "/data/emergency.json");
const _ = require("lodash");
const Collection = require(__dirname + "/collections.js");

// Instatiate collections of drug data
let standard = new Collection(_jsonData);

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

let animal = "";
let units = "kgs";
let weight = 0;
let dataSource = {};

app.post("/category-select", function(req, res){
  let subData = {};
  let tier = req.body.tier;
  if (tier === "0") {
    animal = req.body.animal;
    units = req.body.units;
    weight = req.body.weight;
    switch (req.body.selected) {
      case "EMERGENCY":
        dataSource = _emergencyJsonData;
        break;
      default:
      dataSource = _jsonData;
    }
  } else {
    dataSource = dataSource[req.body.selected];
  }

  if (tier === "2") {
    res.render("drug-list", {data: drugsByAnimal(dataSource)});
    return;
  }

  let passData = [];
  for (element in dataSource) {
    passData.push(element);
  }

tier++;
  res.render("category", {
      data: passData,
      tier: tier
  });
});

// Functions

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
