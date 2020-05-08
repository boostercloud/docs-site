function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  }

if(getCookie("_cookies_acceptance") != "true"){
    document.getElementById("cookie_container").style.display = 'inline-grid'; 
}
      
function close_cookie_banner(){
    document.getElementById("cookie_container").style.display = 'none';
    document.cookie = "_cookies_acceptance=true";
}