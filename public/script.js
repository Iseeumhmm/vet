
$(document).ready(function() {
  $('#option2').change(function() {
    $("#weightInput").next("label").text("lbs");
    $("#postId").val("lbs");
    const lbs = $('#weightInput').val();
    let weight = lbs;
    if (lbs > 1) {
      weight *= 2.2;
    }
    $('#weightInput').val(weight.toFixed(2));
    $('form#weight').submit();
  });
  $('#option1').change(function() {
    $("#weightInput").next("label").text("kgs");
    $("#postId").val("kgs");
    const lbs = $('#weightInput').val();
    let weight = lbs;
    if (lbs > 1) {
      weight /= 2.2;
    }
    $('#weightInput').val(weight.toFixed(2));
    $('form#weight').submit();
  });
  $('#categoryForm').on('change', function() {
    $('#outerCategoryForm').submit();
  });
});
