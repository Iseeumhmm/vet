let parent = window.parent.document;
//Landing Page js
let animal = parent.getElementById("animal");

if (animal) {
  animal.addEventListener("click", function () {
    let pet = parent.getElementById("pet");
    console.log("This is inside addEventListener: " + pet.value);
    if (pet.value === "dog") {
      pet.value = "cat";
    } else if (pet.value === "cat") {
      pet.value = "dog";
    }
    parent.querySelector("div.card__side--front").classList.toggle("card__rotate");
    parent.querySelector("div.card__side--back").classList.toggle("card__rotate--back");
  });

  // Toggle radio buttons
  let kgs = parent.querySelector("input.checkbox--kgs");
  if (kgs) {
    let lbs = parent.querySelector("input.checkbox--lbs");
    lbs.addEventListener("change", () => {
      if (kgs.checked === true) {
        kgs.checked = false;
        parent.getElementById("units").value = "lbs";
      }
    });
    kgs.addEventListener("change", () => {
      if (lbs.checked === true) {
        lbs.checked = false;
        parent.getElementById("units").value = "kgs";

      }
    });
  }


  // Listen for category querySelector
  let systemic = parent.getElementById("systemic");
  let emergency = parent.getElementById("emergency");
  checkForClick(systemic);
  checkForClick(emergency);

  function checkForClick(element){
      element.addEventListener("click", function () {
      let weight = parent.querySelector("input.user-input__weight").value;
      parent.getElementById("weight").value = weight;
      parent.getElementById("category-selected").value = element.innerText;
      parent.getElementById("form-data").submit();
    });
  }
}

  // create listener on header for home click

  let home = parent.getElementById("header-container");
  if (home) {
    home.addEventListener("click", function(){
      parent.location.href = ("/");
    });
  }

// app in testing

// let testing = parent.getElementById("suggestions");
// if (testing) {
//   testing.addEventListener("click", function() {
//      parent.location.href = "mailto:iseeumhmm@gmail.com";
//   });
// }
