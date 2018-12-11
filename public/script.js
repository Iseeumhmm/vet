// function save() {
//     var input = document.getElementById("weightInput").value;
//     data.weight = input;
// }

// if ($('#option2').is(':checked')){
//
//   $("#weightInput").next("label").text("lbs");
// };

console.log($('#option1').is(':checked'));
$(document).ready(function(){
  $('#option2').change(function(){
     $("#weightInput").next("label").text("lbs");
     $("#postId").val("lbs");
     const weight = $('#weightInput').val() * 2.2;
     $('#weightInput').val(weight);
  });
  $('#option1').change(function(){
     $("#weightInput").next("label").text("kgs");
     $("#postId").val("kgs");
     const weight = $('#weightInput').val() / 2.2;
     $('#weightInput').val(weight);
  });
});
