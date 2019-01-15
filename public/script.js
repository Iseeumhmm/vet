let parent = window.parent.document;
// $(parent).on( "pagecontainershow", function( event, ui ) {
//   alert("page showing");
// } );
//
// $(document).ready(function() {
//   $('#lbs').change(function() {
//     $("#weightInput").next("label").text("lbs");
//     $("#postUnits").val("lbs");
//     const lbs = $('#weightInput').val();
//     let weight = lbs;
//     if (lbs > 1) {
//       weight *= 2.2;
//     }
//     $('#weightInput').val(weight.toFixed(2));
//   });
//   $('#kgs').change(function() {
//     $("#weightInput").next("label").text("kgs");
//     $("#postUnits").val("kgs");
//     const lbs = $('#weightInput').val();
//     let weight = lbs;
//     if (lbs > 1) {
//       weight /= 2.2;
//     }
//     $('#weightInput').val(weight.toFixed(2));
//   });
// });
let animal = parent.getElementById("animal");
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

// Listen for category querySelector
let systemic = parent.getElementById("systemic");
let emergency = parent.getElementById("emergency");
let category = parent.getElementById("category");
checkForClick(systemic);
checkForClick(emergency);
checkForClick(category);

function checkForClick(element){
  element.addEventListener("click", () => {
    console.log("you clicked " + element.innerHTML);
    let weight = parent.querySelector("input.user-input__weight").value;
    parent.getElementById("weight").value = weight;
    parent.getElementById("category-selected").value = element.innerText;
    parent.getElementById("form-data").submit();
  });
}


function doSubmit() {
  let parent = window.parent.document;
  const weight = parent.getElementById("weightInput").value;
  const units = parent.getElementById("postUnits").value;
  window.document.getElementById("subWeight").value = weight;
  window.document.getElementById("subPostUnits").value = units;
  // parent.getElementById("weight").reset();
  return true;
}
