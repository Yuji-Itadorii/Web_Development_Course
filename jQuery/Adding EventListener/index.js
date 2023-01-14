 $("h1").click(function(){
    alert("I was get clicked!!");
 });
 
 
 //Adding event listerner to multiple buttons
 $("button").click(function(){
    $("h1").css("color" , "purple");
 });


 // Listerns for multiple key
 $("input").keydown(function(event){
    alert(event.key+" was pressed!!");
 });