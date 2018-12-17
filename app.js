const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _jsonData = require(__dirname + "/data.json");
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

  standard.clearData()
  standard.units = "kgs";
  res.render("home");
});

app.post("/", function(req, res) {
  // check to see if it's being redirected to home page
  if (req.body.name === "homePage") {
    res.redirect("/");
  } else {
    standard.Animal = _.lowerCase(req.body.Animal);
    res.redirect("category");
  }
});

// Category Routes
app.get("/category", function(req, res) {
  res.render("category", {
    data: standard.dataPassObject()
  });
});

// Category-Select routes
app.get("/category-select", function(req, res){
  if (!standard.subCategoryPage) {
    standard.getCategories(_jsonData);
  }
  res.render("category-select", {
    data: standard.dataPassObject(), passURL: "/category-select", target: ""
  });
});

app.post("/category-select", function(req, res){
  const category = req.body.category;
  standard.setWeightAndUnits(req.body.weight, req.body.units);
  standard.getSubcategories(category);
  standard.firstCategory = category;
  standard.subCategoryPage = true;
  res.render("category-select", {
    data: standard.dataPassObject(), passURL: "/category-redirect", target: "_top"
  });
});

// Category-redirect
app.post("/category-redirect", function(req, res){
  standard.setWeightAndUnits(req.body.weight, req.body.units);
  res.redirect("/" + standard.firstCategory + "/" + req.body.category);
});

// Dynamic Route (Drug-List)
app.get("/:first/:second", function(req, res) {
  // Variables
  const passedSubCategory = req.params.second;
  const passedCategory = req.params.first;
  const dataFromJSON = _jsonData[passedCategory][passedSubCategory];
  let categoryData = [];
  let capitalAnimal = _.startCase(standard.Animal);
  // Iterate through all drugs in Subcategory
  for (let data in dataFromJSON) {
    // Get each of the drug details in this subcategory
    var detailsFromJSON = _jsonData[passedCategory][passedSubCategory][data][capitalAnimal];
    // Check to see if the drug has labeled dosage for current animal
    if (detailsFromJSON) {
      // Create object and push to categoryArray
      pushData(data, detailsFromJSON, standard.drugData);
    } else {
      // Create stand in data for drugs that don't have doseage for current animal
      const detailsFromJSON = {
        Method: "Not Labeled for " + capitalAnimal + "s",
        Frequency: "------",
        minAmount: "------",
        maxAmount: "------",
      };
      // Create object and push to categoryArray
      standard.pushData(data, detailsFromJSON);
    }
  }
  res.render("drug-list",
    standard.createDrugListObject(passedSubCategory)
  );
});

// Functions
function pushData(_data, _JSONdetails, classObject) {
  let detailsForPassing = {
    drugName: _data,
    drugDetails: _JSONdetails
  };
  // Create Array of {drugName: drugsDetails: } for sending to drug-list
  classObject.push(detailsForPassing);
}
