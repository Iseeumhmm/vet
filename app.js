const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jsonData = require(__dirname + "/data.json");
const _ = require("lodash");

// Variables
let categories = [];
let passData = {
  Animal: "",
  weight: 0,
  categories: categories,
  subCategory: [],
  categoryTitle: "Category"
};

// Json data is being corrupted each time weight is calculated, adding and adding on
// - maybe add a second jsonData to be refreshed from original each time?

// Create Category Array from JSON
for (let category in jsonData) {
  categories.push(category);
}

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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// Get Routing Functions

// Home Route

app.get("/", function(req, res) {
  clearData();
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
  const weight = req.body.weight;
  console.log(req.body);
  passData.weight = weight;

});

// Dynamic Route

app.get("/:submit", function(req, res) {

  let subCategory = [];
  const submitQuery = req.params.submit;

  // populate subCategory Array
  if (subCategory.length == 0) {
    const subJSON = jsonData[submitQuery];
    for (let sub in subJSON) {
      subCategory.push(sub);
    }
  }

  // Update the passData object to be returned
  passData.categoryTitle = submitQuery;
  passData.subCategory = subCategory;
  res.header("Cache-Control: no-cache, no-store");
  res.render("category", {
    data: passData
  });

});

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

      console.log("error no drugs for " + capitalAnimal + "s");
    }
  }
  // For testing only
  categoryData.forEach(function(ele) {
    console.log("categoryData: " + ele.drugDetails.maxAmount);
  });

  res.render("drug-list", {
    category: passedSubCategory,
    drugs: categoryData,
    animal: passData.Animal,
    weight: passData.weight,
  });

});

// Functions

function clearData() {
  passData.subCategory = [];
  passData.Animal = "";
  passData.categoryTitle = "Category"
  passData.weight = null;
}

function pushData(_data, _JSONdetails, dataArray) {
  let detailsForPassing = {
    drugName: _data,
    drugDetails: _JSONdetails
  };
  // Create Array of {drugName: drugsDetails: } for sending to drug-list

  dataArray.push(detailsForPassing);
}

// Notes:
//
// * when refeshing /category icon disappears
