

$(".categ").change(function(){
  $(".subCatDrop").css("visibility", "visible");
});

$(".categ").focus(function(){
  $(".subCatDrop").css("visibility", "hidden");
});

function hide(element){
  $(element).css("visibility", "hidden");
  console.log("inside the function" + element);
};
