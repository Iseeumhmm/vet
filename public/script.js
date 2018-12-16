let parent = window.document;
$(parent).on( "pagecontainershow", function( event, ui ) {
  alert("page showing");
} );

$(document).ready(function() {
  $('#lbs').change(function() {
    $("#weightInput").next("label").text("lbs");
    $("#postUnits").val("lbs");
    const lbs = $('#weightInput').val();
    let weight = lbs;
    if (lbs > 1) {
      weight *= 2.2;
    }
    $('#weightInput').val(weight.toFixed(2));
  });
  $('#kgs').change(function() {
    $("#weightInput").next("label").text("kgs");
    $("#postUnits").val("kgs");
    const lbs = $('#weightInput').val();
    let weight = lbs;
    if (lbs > 1) {
      weight /= 2.2;
    }
    $('#weightInput').val(weight.toFixed(2));
  });
});


function doSubmit() {
  let parent = window.parent.document;
  const weight = parent.getElementById("weightInput").value;
  const units = parent.getElementById("postUnits").value;
  window.document.getElementById("subWeight").value = weight;
  window.document.getElementById("subPostUnits").value = units;
  // parent.getElementById("weight").reset();
  return true;
}
