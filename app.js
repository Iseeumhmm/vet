const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jsonData = require(__dirname + "/data.json");
const _ = require("lodash");
// Variables
let categories = [];
let passData = {
  Animal: "",
  weight: null,
  units: "kgs",
  categories: [],
  subCategory: [],
  firstCategory: ""
};
let subCategoryPage = false;


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

// Get Routing Functions

// Home Route

app.get("/", function(req, res) {
  clearData();
  passData.units = "kgs";
  res.render("home");
});

app.post("/", function(req, res) {
  // check to see if it's being redirected to home page
  if (req.body.name === "homePage") {
    res.redirect("/");
  } else {
    passData.Animal = _.lowerCase(req.body.Animal);
    res.redirect("category");
  }
});

// Category Routes

app.get("/category", function(req, res) {
  res.render("category", {
    data: passData
  });
});
// Record the weight sent from category page
app.post("/category", function(req, res) {
  passData.weight = req.body.weight;
  passData.units = req.body.units;
  res.redirect('back');
});

// Category-Select routes

app.get("/category-select", function(req, res){
  if (!subCategoryPage) {
    passData.categories = getCategories(jsonData);
  }
  res.render("category-select", {
    data: passData, passURL: "/category-select", target: ""
  });
});

app.post("/category-select", function(req, res){
  const category = req.body.category;
  passData.categories = getSubcategories(category);
  firstCategory = category;
  subCategoryPage = true;
  res.render("category-select", {
    data: passData, passURL: "/category-redirect", target: "_top"
  });

  //
});

app.post("/category-redirect", function(req, res){
  res.redirect("/" + firstCategory + "/" + req.body.category);
});

// Dynamic Route (Drug-List)

// Gather passed Sub Category data and pass drugs to drug-list
app.get("/:first/:second", function(req, res) {
  // Variables
  const passedSubCategory = req.params.second;
  const passedCategory = req.params.first;
  const dataFromJSON = jsonData[passedCategory][passedSubCategory];
  let categoryData = [];
  let capitalAnimal = _.startCase(passData.Animal);
  // Iterate through all drugs in Subcategory
  for (let data in dataFromJSON) {
    // Get each of the drug details in this subcategory
    var detailsFromJSON = jsonData[passedCategory][passedSubCategory][data][capitalAnimal];
    // Check to see if the drug has labeled dosage for current animal
    if (detailsFromJSON) {
      // Create object and push to categoryArray
      pushData(data, detailsFromJSON, categoryData);
    } else {
      // Create stand in data for drugs that don't have doseage for current animal
      const detailsFromJSON = {
        Method: "Not Labeled for " + capitalAnimal + "s",
        Frequency: "------",
        minAmount: "------",
        maxAmount: "------",
      };
      // Create object and push to categoryArray
      pushData(data, detailsFromJSON, categoryData);
    }
  }

  let converter = 1;
  if (passData.units === "lbs") {
    converter = 0.454545;
  }

  res.render("drug-list", {
    category: passedSubCategory,
    drugs: categoryData,
    animal: passData.Animal,
    weight: passData.weight,
    units: passData.units,
    converter: converter
  });

});

// Functions

function clearData() {
  passData.subCategory = [];
  passData.Animal = "";
  passData.firstCategory = ""
  passData.weight = null;
  subCategoryPage = false;
}

function pushData(_data, _JSONdetails, dataArray) {
  let detailsForPassing = {
    drugName: _data,
    drugDetails: _JSONdetails
  };
  // Create Array of {drugName: drugsDetails: } for sending to drug-list
  dataArray.push(detailsForPassing);
}


// Create Category Array from JSON
function getCategories(json) {
  let categories = [];
  for (let category in json) {
    categories.push(category);
  }
  return categories;
}


// Get Category: Subcategory object
function getSubcategories(category) {

  let subCategory = [];

  if (subCategory.length == 0) {
    const subJSON = jsonData[category];
    for (let sub in subJSON) {
      subCategory.push(sub);
    }
  }
  return subCategory;
}
