
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jsonData = require(__dirname + "/data.json");
const $ = require('jquery');
const _ = require("lodash");

let categories = [];

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
  const animal = req.body.Animal;
  res.render("drugs", {Animal: _.lowerCase(animal), categories: categories})
});

app.post("/drugs", function(req, res){
  const category = req.body.Categories;

  if (category) {
    const subCategory = jsonData.Category[category];

    // res.redirect("drugs", {categories: categories, subCategory: subCategory});
  }
  console.log(category);

});

// Functions
