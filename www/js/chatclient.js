//const WebSocket = require("ws");
var vapp;
var storeclient;// = new WebSocket("ws://127.0.0.1:100");
var carrierclient;
var storestatus = "";
var carrierstatus = "";
var cnetname = "";
var snetname = "";

var cusername = "";
var creceiver= "";
var susername = "";
var sreceiver = "";
function openStoreConn()
{
	if(storeclient == null)
	{
		storeclient = new WebSocket("ws://127.0.0.1:100");//storeserver.php");
		if(storeclient != null)
			setOptions(storeclient,storestatus);
		else
			console.log("Client undefined");
	}
	else
		console.log("Already connected to stores.");
}

function openCarrierConn()
{
	if(carrierclient == null)
	{
		carrierclient = new WebSocket("ws://127.0.0.1:120");//carrierserver.php");
		if(carrierclient != null)
			setOptions(carrierclient,carrierstatus);
		else
			console.log("Client undefined");
	}
	else
		console.log("Already connected to carriers.");
}

function openUserConn(type)
{
	if(type == "carrier")
	{
		openCarrierConn();
	}
	else
	{
		openStoreConn();
	}
	
	if(storeclient == null && carrierclient == null)
		console.log("Client undefined");
}

function setOptions(chatclient,serverstatus)
{//0834220033
chatclient.onopen = function(e){ 
	//var server_message = e.data; 
	if (chatclient.readyState === WebSocket.CONNECTING) 
    {
    	console.log("Connecting");
    }
	if (chatclient.readyState === WebSocket.OPEN) 
    {
    	//alert("Opened Connection");
	    console.log("You are connected");
	    //chatclient.send("Hello server");
	}
};

chatclient.onmessage = function(e){ 
	//var server_message = e.data;
	var rtxt = jQuery.parseJSON(e.data);
    //console.log("Received: " + e.data);
    if(rtxt.type == "request")
    {
    	if(rtxt.message == "accepted")
    	{
    		if(rtxt.server == "store")
    		{
    			susername = rtxt.username;
    			sreceiver = rtxt.sender;
    		}
    		if (rtxt.server == "carrier")
    		{
    			cusername = rtxt.username;
    			creceiver = rtxt.sender;
    		}
    		jQuery("#requestreply").css({"color":"green"});
    		//jQuery("#requestreply").html();
    		//if(rtxt.server == "carrier")
    		serverstatus = "The " + rtxt.server + " has accepted your request. Please continue with your order.";
    		console.log("Request accepted");
    	}
    	if(rtxt.message == "rejected")
    	{
    		jQuery("#requestreply").css({"color":"Black"});
    		//jQuery("#requestreply").html("The carrier is unavailable. Please choose another carrier.");
    		serverstatus = "The " + rtxt.username + " is not taking orders currently. Please choose again.";
    		console.log("Request rejected");
    	}
    }
    if(rtxt.type == "order")
    {
    	if(rtxt.message == "complete")
    	{
    		jQuery("#storestatus").css({"color":"green"});
    		//jQuery("#storestatus").html("Your order is ready!");
    		serverstatus = "Your order is ready!";
    	}
    	if(rtxt.message == "pickedup")
    	{
    		jQuery("#carrierstatus").css({"color":"green"});
    		//jQuery("#carrierstatus").html("Your order is on its way!");
    		carrierstatus = "Your order is on its way!";
    	}
    	if(rtxt.message == "arrived")
    	{
    		jQuery("#carrierstatus").css({"color":"green"});
    		//jQuery("#carrierstatus").html("Your order has arrived!");
    		carrierstatus = "Your order has arrived!";
    	}
    }
    else if(rtxt.type == "usermsg")
    {
    	if(rtxt.server == "store")
    	{
    		//susername = rtxt.username;
    		jQuery("#storemsgs").html(jQuery("#storemsgs").html() + "<br/><div class =\"w3-row\"><div class =\"w3-padding w3-left w3-medium w3-orange\"><b>Store</b><br />" + rtxt.message + "</div></div>");
    	}
    	if(true)//rtxt.server == "carrier")
    	{
    		cusername = rtxt.username;//remove
    		creceiver = rtxt.sender;//remove
    		console.log("Here");
    		jQuery("#carriermsgs").html(jQuery("#carriermsgs").html() + "<br/><div class =\"w3-row\"><div class =\"w3-padding w3-left w3-medium w3-amber\"><b>" + rtxt.username + "</b><br />" + rtxt.message + "</div></div>");
    	}
    	console.log("Message received");
    }
    else if(rtxt.type == "userinfo")
    {
    	if(rtxt.server == "store")
    	{
    		snetname = rtxt.message;
			storeclient.send('{"type":"userinfo","sender":"' + snetname + '","username":"' + vapp.username + '"}');

    		console.log(snetname);
    	}
    	if(rtxt.server == "carrier")
    	{
    		cnetname = rtxt.message;
			carrierclient.send('{"type":"userinfo","sender":"' + snetname + '","username":"' + vapp.username + '"}');
    	}
    	console.log("User info received and username(" + vapp.username + ") sent");
    }
    else if(rtxt.type == "admin")
    {
    	alert(rtxt.message);
    }
    else if(rtxt.type == "confirm")
    {
    	jQuery("#message").html(rtxt.message);
    }
    else
    {
    	jQuery("#message").html(rtxt.message);
    }
};

chatclient.addEventListener("close", function(){
	console.log("Connection closed");
});

chatclient.addEventListener("error", function(e){
	console.log("Connection error: " + e.Error);
});
}

//sendProfile()
function sendRequest(server,receiver,message)
{
	if(server == "store")
	{
		storeclient.send('{"type":"request","receiver":"store","receivername":"' + receiver + '","sender":"' + snetname + '","username":"' + vapp.username + '","orderid":"' + vapp.cart.orderid + '","message":"' + message + '"}');
		storestatus = "Sending request and waiting for a reply...";
	}
	else if(server == "carrier")
	{
		carrierclient.send('{"type":"request","receiver":"carrier","receivername":"' + receiver + '","sender":"' + cnetname + '","username":"' + vapp.username + '","orderid":"' + vapp.cart.orderid + '","message":"' + message + '"}');
		carrierstatus = "Sending request and waiting for a reply...";
	}
	else
		alert("No connection");
	//if(jQuery("#message") != null)
	//	jQuery("#message").html(jQuery("#message").html() + "<br/>You: " + message);
	//jQuery("#orderreply").html("Sending request and waiting for a reply...");
	console.log("Request sent");
}

function sendOrder(server,id,meals,notes,storename)
{
	if(server == "store")
	{
		storeclient.send('{"type":"order","receiver":"store","receivername":"' + susername + '","sender":"' + snetname + '","username":"' + vapp.username + '","orderid":"' + id + '","meals":"' + meals + '","notes":"' + notes + '","storename":"' + storename + '"}');
	}
	else if(server == "carrier")
	{
		carrierclient.send('{"type":"order","receiver":"carrier","receivername":"' + cusername + '","sender":"' + cnetname + '","username":"' + vapp.username + '","orderid":"' + id + '","meals":"' + meals + '","notes":"' + notes + '","storename":"' + storename + '"}');
	}
	else
		alert("No connection");
	//if(jQuery("#message") != null)
	//	jQuery("#message").html(jQuery("#message").html() + "<br/>You: " + message);

	jQuery("#requestreply").html("Sending request and waiting for a reply...");
	console.log("Order sent");
}

function sendMessage(server,message)
{
	if(server == "store")
	{
		storeclient.send('{"type":"usermsg","receiver":"' + sreceiver + '","receivername":"' + susername + '","sender":"' + snetname + '","username":"' + vapp.username + '","message":"'  + message + '"}');
		jQuery("#storemsgs").html(jQuery("#storemsgs").html() + "<br/><div class =\"w3-row\"><div class =\"w3-padding w3-right w3-medium w3-light-grey\"><b>Me</b><br />" + message + "</div></div>");
	}
	else if(server == "carrier")
	{
		carrierclient.send('{"type":"usermsg","receiver":"' + creceiver + '","receivername":"' + cusername + '","sender":"' + cnetname + '","username":"' + vapp.username + '","message":"' + message + '"}');
		jQuery("#carriermsgs").html(jQuery("#carriermsgs").html() + "<br/><div class =\"w3-row\"><div class =\"w3-padding w3-right w3-medium w3-light-grey\"><b>Me</b><br />" + message + "</div></div>");
	}
	else
		alert("No connection");
	//if(jQuery("#message") != null)
	//	jQuery("#message").html(jQuery("#message").html() + "<br/>You: " + message);
	console.log("Message sent");
}

function thepoints()
{
	var g = navigator.getLocation;
	g.getCurrentPosition(success,failure);

}
function success(position)
{
	var lat = position.coords.latitude;
	var long = position.coords.longitude;

	var myLatlng = new google.maps.LatLng(lat, long);
	var mapOptions = {
		zoom: 18,
		center: myLatlng,
		mapTypeId: 'roadmap'
	};
	var mymap = new google.maps.Map(document.getElementById('deliveryMap'));
	var marker = new google.maps.Marker({map:mymap,position:myLatlng});
}

function failure()
{}