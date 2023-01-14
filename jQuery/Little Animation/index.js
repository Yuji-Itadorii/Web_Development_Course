 $(".show").click(function (){
   $("h1").show();
   console.log("Show clicked");
 });


 $(".hide").click(function (){
   $("h1").hide();
   console.log("hide clicked");
 });

 $(".toogle").click(function (){
   $("h1").toggle();
 });

 $(".fadeout").click(function (){
   $("h1").fadeOut();
 });


 $(".fadein").click(function (){
   $("h1").fadeIn();
 });
 
 $(".fadetoggle").click(function (){
   $("h1").fadeToggle();
 });


 $(".slidetoggle").click(function (){
   $("h1").slideToggle();
 });



//Animating Custom CSS which only take numerical values

 $(".animate").click(function (){
   $("h1").animate({opacity : 0.3});
 });


 $(".chain").click(function (){
   $("h1").slideUp().slideDown().animate({opacity : 0.3});
 });


