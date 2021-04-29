var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var months_digits = ["01","02","03","04","05","06","07","08","09","10","11","12"];
var server = "http://127.0.0.1:80/enbe/";

function startLogin()
{
  var log_id;
  var cid;
  log_id = jQuery("#_password").val();
  //alert(log_id);
  cid = getCookie('clientid');
  if(log_id != "" && cid != "")
  {
    jQuery.ajax({type:"POST",url:"login.php",data:{sent:log_id,clientid:cid}}).done(function(data){
      
      /*alert(data);*/
      if(data != "")
      {
        var response_txt = jQuery.parseJSON(data);

        if(response_txt.retid != "2222")
        {
          var now = new Date();
          document.cookie = "username=" + response_txt.retmsg + ";expire=" + (now + 1);
          
          jQuery("#log_result").html("<b style = 'color: green'>Welcome come back! Redirecting...</b>" + response_txt.retmsg);
          setTimeout(function(){
            window.location.href = "home.php";
          },3000);
        }
        else
        {
          jQuery("#log_result").css({"color":"Red"});
          jQuery("#log_result").html(response_txt.retmsg + " - &nbsp;&nbsp;<a href ='signup.php' style ='color: rgb(255,128,0);'>Sign Up?</a>");
        }
        
      }
      else
      {
        alert("No response!");
      }//
    });
  }
  else
  {
    alert("You haven't entered your password yet.");
  }
}

function startLogout()
{
  var cid = getCookie('clientid');
  var usr = getCookie('username');
  if(usr != "" && cid != "")
  {
    jQuery.ajax({type:"POST",url:"../logout.php",data:{clientid:cid}}).done(function(data){
      
      //jQuery("#log_result").html("<b style = 'color: white'>" + data + "</b>");
      if(data != "")
      {
        var response_txt = jQuery.parseJSON(data);

        if(response_txt.retid != null && response_txt.retid == "1111")
        {
          //document.cookie = "userid=" + response_txt.userid + ";expire=" + (Date() + 1);
          var now = new Date();
          document.cookie = "username=o.t;expire=" + (now - 1);
          //document.cookie = "usertoken=" + response_txt.usertoken + ";expire=" + (Date() + 1);
          //alert(data + " - ");
          //jQuery("#log_result").html("<b style = 'color: green'>Welcome come back! Redirecting...</b>" + response_txt.retmsg);
          alert("Successfully logged out.");
          setTimeout(function(){
            window.location.href = "../home.php";
          },3000);/**/
        }
        else if(response_txt.retid != null && response_txt.retid == "2222")
        {
          /*jQuery("#log_result").css({"color":"Red"});
          jQuery("#log_result").html(response_txt.retmsg + " - &nbsp;&nbsp;<a href ='signup.php' style ='color: rgb(255,128,0);'>Sign Up?</a>");
          */
          alert("Couldn't log you out successfully. Please try again. " + response_txt.retmsg);
        }
        else
        {
          alert("There was a technical error");
        }
      }
      else
      {
        alert("No response!");
      }//
    });
  }
  else
  {
    alert("You aren't logged in or there might be a problem with your connection.");
  }
}

function startSearch()
{
  var stxt;
  var country;
  var province;
  var city;
  var ctgry;

  stxt = jQuery("#txt_search").val();
  country = jQuery("#country_lbox").val();
  province = jQuery("#province_lbox").val();
  city = jQuery("#town_lbox").val();
  ctgry = jQuery("#category_lbox").val();

  jQuery.ajax({type:"GET",url:"search.php",data:{country:country,province:province,town:city,category:ctgry,searchtxt:stxt}}).done(function(data){
    var rtxt = data;
    var event_arr = jQuery.parseJSON(rtxt);

    if(event_arr.length > 0)
    {
      var output = "";
      if(event_arr.length > 15)
      {
        
        for(var i = 0; i < 15; i++)
        {
          output += eventTemplate(event_arr[i].id,event_arr[i].title,event_arr[i].description,event_arr[i].picid,event_arr[i].owner);
        }
      }
      else
      {
        for(var i = 0; i < event_arr.length; i++)
        {
          output += eventTemplate(event_arr[i].id,event_arr[i].title,event_arr[i].description,event_arr[i].picid,event_arr[i].owner);
        }
      }
      return output;
    }
  });
}

function busy(controlid)
{
  jQuery("#" + controlid).html("<img src = 'Images/busy.png' alt ='' width ='100' height ='90' />");
}

function getCookie(cookiename)
{
  var cookietxt = new String();
  var cook_val = new String();
  var output_result = "";

  cook_val = cookiename;
  cookietxt = document.cookie.toString();

  var cookie_array = cookietxt.split(";");
  for(var i = 0; i < cookie_array.length; i++)
  {
    var item_arr = cookie_array[i].split("=");
    if(item_arr[0].trim() == cook_val)
    {
      output_result = item_arr[1];
    }
    //output_result = item_arr[1];
  }
  
  return output_result;
}

function checkResize()
{
  var result = false;
  var yy = new String();
  yy = navigator.userAgent;
  if(jQuery(window).width() < 600 || yy.match("Android") || yy.match("iPad") || yy.match("iPhone"))
  {
    result = true;
  }
  return result;
}

function getClientId()
{
  var cid;
  cid = getCookie('clientid');
  
  if(cid == "")
  {
    jQuery.ajax({type:"POST",url:"front_desk.php",data:{qry:"hello"}}).done(function(data){
      if(data != "")
      {
        var rtxt = jQuery.parseJSON(data);
        if(rtxt[0].name == "ok")
        {
          document.cookie = rtxt[1].name + "=" + rtxt[1].connectid + ";expire=" + (Date() + 1);
          document.cookie = rtxt[2].name + "=" + rtxt[2].connectid + ";expire=" + (Date() + 1);
          //alert("Cookie: " + getcookie("swish"));
        }
        else
        {
          alert("Accounts connection is down! Please wait to login.");
        }/**/
        //alert(data);
      }
    }).error(function(x,e,s){
      alert("Erro connecting to \"Accounts\"! \n" + e + "\n\nPlease wait to login.");
    });
  }
}

var lat;
var long;

function getGeoPosition()
{
    var g = navigator.getLocation;
    g.getCurrentPosition(success,failure);

}
function success(position)
{
    lat = position.coords.latitude;
    long = position.coords.longitude;
}

function failure()
{
    alert("Couldn't fetch coordinates.");
}

function drawMap(element)
{
    if(lat != null & long != null)
    {
        var myLatlng = new google.maps.LatLng(lat, long);
        var mapOptions = {
            zoom: 18,
            center: myLatlng,
            mapTypeId: 'roadmap'
        };
        var mymap = new google.maps.Map(document.getElementById(element));
        var marker = new google.maps.Marker({
            map:mymap,
            position:myLatlng,
            icon:'../res/guest.png',
            animation: google.maps.Animation.BOUNCE
        });
        marker.setMap(mymap);
    }
}

function calculateDistance(origin,destination,travelmode)
{
    var serv = new google.maps.DistanceMatrixService();
    var dObj;

    dObj = {
        origins: origin,
        destinations: destination,
        travelMode: travelmode,
        unitSystem: "",
        avoidHighways: false,
        avoidTolls: false
    };
    serv.getDistanceMatrix(dObj, displayDistance);
    
}

function displayDistance(response,status)
{
    var distobject = [];
    if(status == "OK")
    {
        for(var c = 0; c < response.rows.length; c++)
        {
            for(var v = 0; v < response.rows[c].elements.length; v++)
            {
                distobject.push(response.rows[c].elements[v]);
            } 
        }
    }
    return distobject;
}