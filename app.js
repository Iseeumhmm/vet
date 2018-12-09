
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jsonData = require(__dirname + "/data.json");
const $ = require('jquery');
const _ = require("lodash");

let categories = [];
let animal = "";
let subCategory = [];

for (let category in jsonData.Category) {
  categories.push(category);
}


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

app.get("/", function(req, res){
  res.render("home");
});

app.post("/", function(req, res){
  animal = req.body.Animal;
  res.redirect("drugs");
});

app.get("/drugs", function(req, res){
  const passData = {Animal: _.lowerCase(animal), categories: categories, subCategory: subCategory, categoryTitle: "Category"};
  res.render("drugs", {data: passData});
});

app.post("/drugs", function(req, res){
  const category = req.body.Categories;

  if (category) {
    const subJSON = jsonData.Category[category];
    for (let sub in subJSON){
      subCategory.push(sub);
    }
    res.redirect("drugs");
  }
});

app.get("/:submit", function(req, res){
  const submitQuery = req.params.submit;
  console.log(submitQuery);

});


// Functions
