const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _jsonData = require(__dirname + "/data/data.json");
const _emergencyJsonData = require(__dirname + "/data/emergency.json");
const _ = require("lodash");
const Collection = require(__dirname + "/collections.js");

// Instatiate collections of drug data
let standard = new Collection(_jsonData);
let byDrug = new Collection(_jsonData);
let emergency = new Collection(_emergencyJsonData);


// Setup Server
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.setHeader('Expires', '-1');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

// Home Route
app.get("/", function(req, res) {
  clearData()
  res.render("home");
});

app.post("/", function(req, res) {
  // check to see if it's being redirected to home page
  if (req.body.name === "homePage") {
    res.redirect("/");
  } else {
    setAnimal(req.body.Animal);
    res.redirect("category");
  }
});

// Category Routes
app.get("/category", function(req, res) {
  res.render("category", {
    data: standard.dataPassObject(),
  });
});

// Category-Select routes
app.get("/category-select", function(req, res){
  if (!standard.subCategoryPage) {
    standard.getCategories(_jsonData);
  }
  res.render("category-select", renderPageData(standard, "category"));
});

app.get("/_category-select", function(req, res){
  if (!byDrug.subCategoryPage) {
    byDrug.getCategories(_jsonData);
  }
  res.render("_category-select", renderPageData(byDrug, "emergency"));
});

app.get("/emergency-select", function(req, res){
  if (!emergency.subCategoryPage) {
    emergency.getCategories(_emergencyJsonData);
  }
  res.render("emergency-select", renderPageData(emergency, "emergency"));
});

app.post("/category-select", function(req, res){
  selectPostDataParser(standard, req.body);
  res.render("category-select", {
    data: standard.dataPassObject(), passURL: "/category-redirect", target: "_top"
  });
});

app.post("/emergency-select", function(req, res){
  selectPostDataParser(emergency, req.body);
  res.render("emergency-select", {
    data: emergency.dataPassObject(), passURL: "/emergency-redirect", target: "_top"
  });
});

// Redirects
app.post("/category-redirect", function(req, res){
  standard.setWeightAndUnits(req.body.weight, req.body.units);
  res.redirect("/standard/" + standard.firstCategory + "/" + req.body.category);
});

app.post("/emergency-redirect", function(req, res){
  emergency.setWeightAndUnits(req.body.weight, req.body.units);
  res.redirect("/emergency/" + emergency.firstCategory + "/" + req.body.category);
});

// Dynamic Route (Drug-List)
app.get("/:collection/:first/:second", function(req, res) {
  let passedCollection = new Collection();
  let _data = {};
  if (req.params.collection === "standard") {
    passedCollection = standard;
    _data = _jsonData;
  } else if (req.params.collection === "byDrug") {
    passedCollection = emergency;
    _data = _emergencyJsonData;
  } else if (req.params.collection === "emergency") {
    passedCollection = emergency;
    _data = _emergencyJsonData;
  }

  // Variables
  const passedSubCategory = req.params.second;
  const passedCategory = req.params.first;
  const dataFromJSON = _data[passedCategory][passedSubCategory];
  let categoryData = [];
  let capitalAnimal = _.startCase(passedCollection.Animal);
  // Iterate through all drugs in Subcategory
  for (let data in dataFromJSON) {
    // Get each of the drug details in this subcategory
    var detailsFromJSON = _data[passedCategory][passedSubCategory][data][capitalAnimal];
    // Check to see if the drug has labeled dosage for current animal
    if (detailsFromJSON) {
      // Create object and push to categoryArray
      passedCollection.pushData(data, detailsFromJSON);
    } else {
      // Create stand in data for drugs that don't have doseage for current animal
      const detailsFromJSON = {
        Method: "Not Labeled for " + capitalAnimal + "s",
        Frequency: "------",
        minAmount: "------",
        maxAmount: "------",
      };
      // Create object and push to categoryArray
      passedCollection.pushData(data, detailsFromJSON);
    }
  }
  res.render("drug-list",
    passedCollection.createDrugListObject(passedSubCategory)
  );
});






// Functions

function setAnimal(animal) {
  standard.Animal = _.lowerCase(animal);
  emergency.Animal = _.lowerCase(animal);
}

function clearData() {
  standard.clearData();
  emergency.clearData();
}

function renderPageData(collection, name){
  let data = {
    data: collection.dataPassObject(),
    passURL: "/" + name + "-select",
    target: ""
  }
  return data;
}

function selectPostDataParser(collection, reqBody) {
  const category = reqBody.category;
  collection.setWeightAndUnits(reqBody.weight, reqBody.units);
  collection.getSubcategories(category);
  collection.firstCategory = category;
  collection.subCategoryPage = true;
}
