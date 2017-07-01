$(document).ready(function(){
  if(location.pathname== '/')
     $("div.fondo").addClass("pagina-registro");
   if(location.pathname.includes("login"))
      $("div.fondo").addClass("pagina-login");
    if(location.pathname.includes("calendarhome")){
    
       $("div.fondo").addClass("pagina-calendar");
     }

});
