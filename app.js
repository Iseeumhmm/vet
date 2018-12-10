const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jsonData = require(__dirname + "/data.json");
const _ = require("lodash");

// Variables
let categories = [];
let passData = {
  Animal: "",
  categories: categories,
  subCategory: [],
  categoryTitle: "Category"
};

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

// Drugs Route

app.get("/category", function(req, res) {
  res.render("category", {
    data: passData
  });
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
    const detailsFromJSON = jsonData[passedCategory][passedSubCategory][data][capitalAnimal];
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
  res.render("drug-list", {
    category: passedSubCategory,
    drugs: categoryData,
    animal: passData.Animal
  });
});

// Functions

function clearData() {
  passData.subCategory = [];
  passData.Animal = "";
  passData.categoryTitle = "Category"
}

function pushData(_data, JSONdetails, dataArray) {
  let detailsForPassing = {
    drugName: _data,
    drugDetails: JSONdetails
  };
  // Create Array of {drugName: drugsDetails: } for sending to drug-list
  dataArray.push(detailsForPassing);
}

// Notes:
//
// * when refeshing /category icon disappears
