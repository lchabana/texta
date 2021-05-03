var topBar = '<div id ="topbar" class ="w3-row">' +
	'<div class="w3-col s5 w3-padding">' +
		'<a href ="/" onclick ="open-screen(\'settings\')" class ="w3-left" style ="display: block;">' +
		'<img src ="img/girl.jpg" alt ="" width ="45" height="40" class="w3-circle w3-border w3-border-white" /></a>' +
		'<a v-if="!name" href= "javascript:void(0)" onclick="openScreen(\'camera\')" class ="fa fa-camera w3-xlarge" style ="color: White; margin: 7px 0 0 20px;"></a>' +
	'</div>' +
	'<div class="w3-col s3 w3-padding w3-center">' +
		'<a v-if="name" id="nametab" href ="javascript:void(0)">{{name}}</a>' +
	'</div>' +
	'<div class ="w3-col s4" style="padding: 18px 35px 0 0;">'+
	'<a href ="javascript:void(0)" style ="display: block; background-color: red;"><i class ="fa fa-chevron-down w3-text-white w3-large w3-right"></i></a>' +
	'</div>' +
	'</div>';

Vue.component("top-bar",{
	props:["name"],
	methods: {
		//openscreen: function(){}
	},
	template: topBar
})

var intro = '<div id ="intro">' +
	'<h4>Add Details</h4>' +
	'<p>Please add your log in ID</p><br />' +
	'<input v-model="username" type="text" placeholder="username" />' +
	'<input v-model="phone" type="text" placeholder="Phone Number" />' +
	'<input type="button" value ="Done" @click="addDetails" class ="w3-btn" />' +
	'</div>';

Vue.component("intro",{
	data: function(){
		return {
			username: "",
			phone: ""
		}
	},
	mounted: function(){
		//this.$emit('log','recent');
	},
	methods: {
		addDetails: function(){
			jQuery.ajax({type:"POST",url:"localhost:100/users.php",data:{qry:"details",name:this.username,number:this.phone}}).done(this.logResult);
			this.logResult();
			
		},
		logResult: function(data){
			//alert(data);
			//this.$emit('log','recent');
			openScreen("recent");
		},
	},
	template: intro
})

var recent = '<div id="recent" class ="w3-row w3-hide" style = "">' +
	'<div class ="">' +
	'<a href ="javascript:void(0)" v-for ="person in people" @click ="chooseChat(person.name)" class ="useritem">' +
	'<img src ="img/guest.png" alt ="" width ="60" height ="46" class ="w3-col" style ="max-width: 60px;" />' +
	'<span class ="w3-col">{{person.name}}<br />' +
	'{{person.rating}}</span>' +
	'</a>' +
	'<a href ="javascript:void(0)" @click="showContacts" style ="height: 40px; padding: 16px; margin: 20px; border-radius: 50%; float: right; background-color: rgb(0,64,128);"><i class = "fa fa-user w3-center"></i></a>' +
	'</div>' +
	'</div>';

Vue.component("recent",{
	//props: ["basket"],
	data: function(){
		return {
			price: 25.00,
			basket: [{id:"5345",product:"Wings and chips",price:25},
			{id:"7356",product:"Burger and cola",price:30},
			{id:"7356",product:"Beef sandwich",price:20}],
			people: [
				{name:"Bill",rating:"7/10"},
				{name:"Bob",rating:"9/10"},
				{name:"James",rating:"7/10"},
				{name:"Tom",rating:"8/10"},
				{name:"Walter",rating:"8/10"},
				{name:"Gary",rating:"5/10"}],
			contacts: [],
			delivery: 30.00,
			deliveryChoice: "By Car",
			total: 0,
			currency: "R",
			ordered: false,
			searchword: "",
			carrier: null,
			accepted: "Choose a carrier"
		}
	},
	computed: {
		total: function(){
			var ttl = 0;
			for(var i = 0; i < this.basket.length; i++)
			{
				ttl += this.basket[i].price;
			}
			ttl += this.delivery;
			return ttl;
		},
		carrierstatus: function(){
			return carrierstatus;
		}
	},
	methods: {
		findPeople: function(){
			var key = "";
			jQuery.ajax({type:"GET",url:"carriers.php",data:{qry:"search",keyword:key}}).done(displayPeople);
		},
		displayPeople: function(data){
			var rettxt = jQuery.parseJSON(data);
			this.people = rettxt.retmsg;
		},
		showContacts: function(){
			var opts = new ContactFindOptions();
			opts.filter = "";
			opts.multiple = true;
			var fields = ["displayName"];
			navigator.contacts.find(fields,cntSuccess,cntError,opts);
		},
		cntSuccess: function(contacts){},
		cntError: function(error){},
		chooseChat: function(value){
			var choice = value;
			alert(choice);
			for(var i = 0; i < this.people.length; i++)
			{
				if (choice == this.people[i].name) {
					this.carrier = this.people[i];
					break;
				}
			}
			this.$emit("set-chat",this.carrier.name);
			//jQuery("#ppllist").css({"visibility":"visible","display":"none"});
			//sendRequest("carrier","carrier","Pizza Hut, Goldstein Mall");
		},
		confirmDelivery: function(){
			/*var orderid = getCookie("orderid");
			var meals = getCookie("meals");
			var notes = getCookie("notes");
			var storename = getCookie("storename");
			sendOrder("carrier",orderid,meals,notes,storename);*/
			if(this.carrier == null)
				alert("Please choose a carrier");
			else
				this.$emit('chat',this.carrier.name);
		}
	},
	template: recent
})

var contacts = '';

var chatBoard = '<div id ="chatBoard" class ="chat w3-row w3-white w3-hide">' +
		'<div id ="ctab" class ="w3-row w3-padding w3-center w3-black w3-hide" style ="height: 50px;">' +
			
		'</div>' +
		'<div id ="carriermsgs" class ="w3-row w3-padding w3-border chatspace" style ="min-height: 500px; overflow: scroll;">' +
		//'<p v-for ="mg in messageslist">{{mg.sender}}<br /><br />{{mg.date}}</p>' +
		'</div>' +
		'<div class ="w3-row" style ="padding: 15px 1%; background-color: rgb(0,64,128);">' +
			'<textarea v-model ="mymessage" rows="1" class ="w3-input w3-col w3-round-large" style ="width: 65%; min-height: 36px; margin: 0 1% 0 0;"></textarea>' +
			'<div class="w3-col chatbtns" style="width: 33%;">' +
			'<a href= "javascript:void(0)" @click ="addFile" class ="w3-col w3-white w3-border w3-round-large"><i class ="fa fa-plus"></i></a>' +
			'<a href= "javascript:void(0)" @click ="openCamera" class ="w3-col w3-white w3-border w3-round-large"><i class ="fa fa-camera"></i></a>' +
			'<a href= "javascript:void(0)" @click ="sendMessage" class ="w3-col w3-white w3-round-large"><i class="fa fa-send"></i></a>' +
			'</div>' +
		'</div>' +
	'</div>';

Vue.component("chat-board",{
	props: ["name"],
	data: function(){
		return {
			mymessage: "",
			messageslist: [
				{sender:"dfsf sdfrm rkeom er",date:new Date()},
				{sender:"reg grth",date:new Date().getTime()},
				{receiver:"jksjdn rgomer reg",date:new Date().getTime()}],
			chatserver: "carrier"
		}
	},
	computed: {
		storestatus: function(){
			return storestatus;
		},
		carrierstatus: function(){
			return carrierstatus;
		}
	},
	created: function(){
		document.addEventListener("backbutton",this.onClose,false);
	},
	methods: {
		showChat: function(chat){
			if(chat == "store")
			{
				this.chatserver = chat;
				if(jQuery("#storemsgs").hasClass("w3-hide") != false)
				{
					if(jQuery("#carriermsgs").hasClass("w3-hide") == false)
						jQuery("#carriermsgs").addClass("w3-hide");
					jQuery("#storemsgs").removeClass("w3-hide");
					jQuery("#ctab").removeClass("w3-light-grey");
					jQuery("#stab").addClass("w3-light-grey");
				}
			}
			if(chat == "carrier")
			{
				this.chatserver = chat;
				if(jQuery("#carriermsgs").hasClass("w3-hide") != false)
				{
					if(jQuery("#storemsgs").hasClass("w3-hide") == false)
						jQuery("#storemsgs").addClass("w3-hide");
					jQuery("#carriermsgs").removeClass("w3-hide");
					jQuery("#stab").removeClass("w3-light-grey");
					jQuery("#ctab").addClass("w3-light-grey");
				}
			}
		},
		onClose: function(){
			event.preventDefault();
			//this.$emit("close",'recent');
			openScreen('recent');
		},
		addFile: function(){
			//if(window.filepickerio != null || window.filepickerio != null)
			//	alert("filepicker exists");
			var filepickerio = window.cordova.require("cordova-plugin-filepickerio");
			//var filepicker = new filepickerio();
			window.filepickerio.setKey('picker');
			window.filepickerio.setName('texta');
			window.filepickerio.pick({
				multiple:false,
				mimeTypes:['image/*','application/pdf'],
				services:['CAMERA','GALLERY','GOOGLE_DRIVE','DROP_BOX'],
				//maxFiles:1,
				maxSize: 20 * 1024 * 1024
			},function(res){
				var fpath = res.filename;
				jQuery("#carriermsgs").html(jQuery("#carriermsgs").html() + '<br/><div class ="w3-row"><div class ="w3-padding w3-right w3-medium w3-light-grey"><b>Me</b><br /><img src="' + fpath + '" alt ="" width="140" height="120" /></div></div>');
				console.log('fetched and displyed image');
			},function(err){

				console.log(err.toString());
			});
			//var selectfile = navigator.notification.openDialog();

		},
		displayFile: function(res){

		},
		openCamera: function(){
			navigator.camera.getPicture(this.onCamSuccess, this.onCamFail, {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL,
				encodingType: 1,
				targetWidth: 480,
				targetHeight: 320
			});
		},
		onCamSuccess: function(imageData){
			alert("hut");
			var nuimg = jQuery('<img src ="" alt="" width="50%" height="80" />');
			nuimg.attr("src","data:image/jpeg;base64," + imageData);
			var contbox = jQuery('<div class ="w3-row"></div>');
			var picbox = jQuery('<div class ="w3-padding w3-left w3-medium w3-amber"></div>');
			picbox.append(nuimg);
			contbox.append(picbox);
			jQuery("#carriermsgs").append(contbox);

			//jQuery("#carriermsgs").html(jQuery("#carriermsgs").html() + "<br/><div class =\"w3-row\"><div class =\"w3-padding w3-left w3-medium w3-amber\"><b>Carrier</b><br />" + rtxt.message + "</div></div>");
		},
		onCamFail: function(message){
			alert("Problem saving image: " + message);
		},
		sendMessage: function(){
			//jQuery.ajax({type:"POST",url:"",data:{}}).done(displayMessage);
			sendMessage(this.chatserver,this.mymessage);
			this.mymessage = "";
		},
		displayMessage: function(data){
			var rettxt = jQuery.parseJSON(data);
			this.messageslist.add(rettxt.retmsg);
		},
		confirmStore: function(){
			var basketid = getCookie("basket");
		},
		createMap: function(){
			/*var myLatlng = new google.maps.LatLng(-34.397, 150.644);
			var mapOptions = {
			  zoom: 18,
			  center: myLatlng,
			  mapTypeId: 'roadmap'
			};
			var map = new google.maps.Map(document.getElementById('deliveryMap'),
			    mapOptions);*/
		}
	},
	template: chatBoard
})

var settings = '<div>'+
	'<a href =""></a>' +
	'</div>';

Vue.component("settings",{
	template: settings
});

var orders = '<div id ="ordersBox" class ="orders w3-container w3-light-grey w3-hide" style="padding:0;">' +
	'<div id ="alertbox" class ="w3-row w3-modal">' +
		'<div class="w3-row w3-padding w3-modal-content w3-round w3-center w3-white" style="width: 300px; height: 210px;">' +
		'<h4>Delivery Request!</h4>' +
		'<p id ="alertmsg">hhhheheherhrhtth</p><br />'+
		'<div class="w3-row">' +
		'<input type ="button" value="Accept" @click ="resolveRequest(\'accepted\')" class="w3-btn w3-text-green w3-transparent w3-border w3-round-xlarge w3-margin-right" />' +
		'<input type ="button" value="Reject" @click ="resolveRequest(\'rejected\')" class="w3-btn w3-transparent w3-text-red w3-border w3-round-xlarge" />' +
		'</div>' +
		'</div>' +
	'</div>' +
	'<div id ="ordercard" class ="w3-row w3-padding w3-margin-bottom w3-hide" style="background-color: White; color: Black; border-bottom: 1px solid lightgrey; position: absolute">' +
		'<h3><a href ="#" @click = "toggleOrder">Order #5355</a></h3>' +
		'<div id ="order" class ="w3-row">' +
			'<div id ="orderdetails" class ="w3-half w3-padding">' +
			'Meal: <span id ="meal"></span><br />' +
			'<br />' +
			'Note: <span id ="note"></span><br /><br />' +
			'</div>' +
			'<div class ="w3-half w3-padding w3-center">' +
			//'<span class ="w3-circle w3-light-grey" style ="width: 150px; height: 130px;"></span>' +
			'<button id="progressbtn" class ="w3-btn w3-circle w3-text-amber" style ="width: 120px; height: 110px; background-color: rgb(32,0,32);">Pending...</button>'+
			'</div>' +
		'</div>' +
	'</div>' +
	'<div id ="map" class ="w3-row" style ="height: 360px;"></div>' +
	'<div class ="w3-row w3-white w3-border" style ="position: absolute; z-index: 1">' +
		'<div class ="w3-row w3-padding" style="background-color: rgb(0,64,128)"><a href ="javascript:void(0)" @click="toggleChat" style="height: 100%; width: 100%; display: block">Chat</a></div>' +
		'<div id ="chatbox" class="w3-row w3-hide">' +
		'<div id ="chatmsgs" class ="w3-row w3-white w3-border chatspace" style="height: 260px;">' +
		//'Ovwe herree'+
		//'cbhillin n buildimng' +
		'</div>' +
		'<div class ="w3-row w3-light-grey">' +
		'<input v-model = "reply" type = "text" class ="w3-input w3-col s9 w3-border" />' +
		'<input type ="button" value ="Send" @click ="sendMessage" class ="w3-btn w3-col s3 w3-blue" />' +
		'</div>' +
		'</div>'+
	'</div>' +
	'</div>';

Vue.component('orders',{
	props: ["type"],
	data: function(){
		return {
			message: "none",
			reply: ""
		}
	},
	/*mounted: function(){
		//this.connectToServer();
	},*/
	methods: {
		connectToServer: function(){
			/*if(this.type == "carrier")
				openCarrierConn();
			else if(this.type == "store")
				openStoreConn();*/
		},
		resolveRequest: function(answer){
			answerRequest(answer);
		},
		sendMessage: function(){
			sendMessage(this.reply);
			this.reply = "";  
		},
		toggleOrder: function(){
			if(jQuery("#order").hasClass("w3-hide") == false)
				jQuery("#order").addClass("w3-hide");
			else
				jQuery("#order").removeClass("w3-hide");
		},
		toggleChat: function(){
			if(jQuery("#chatbox").hasClass("w3-hide") == false)
				jQuery("#chatbox").addClass("w3-hide");
			else
				jQuery("#chatbox").removeClass("w3-hide");
		},
		initMap: function(){
			drawMap('map');
		}
	},
	template: orders
})

var dash = '<div id ="storeDash" class ="storedash w3-container w3-light-grey w3-hide" style="padding:0;">' +
	'<div id ="alertbox" class ="w3-row w3-modal">' +
		'<div class="w3-row w3-padding w3-modal-content w3-round w3-center w3-blue" style="width: 300px; height: 210px;">' +
		'<h4>Delivery Request!</h4>' +
		'<p id ="alertmsg">hhhheheherhrhtth</p><br />'+
		'<div class="w3-row">' +
		'<input type ="button" value="Accept" @click ="resolveRequest(\'accepted\')" class="w3-btn w3-text-green w3-transparent w3-border w3-round-xlarge w3-margin-right" />' +
		'<input type ="button" value="Reject" @click ="resolveRequest(\'rejected\')" class="w3-btn w3-transparent w3-text-red w3-border w3-round-xlarge" />' +
		'</div>' +
		'</div>' +
	'</div>' +
	'<div id ="ordercard" v-for ="o in orders" class ="w3-row w3-padding w3-margin-bottom" style="background-color: White; color: Black; border-bottom: 1px solid lightgrey;">' +
		'<h3><a href ="javascript:void(0)" @click = "toggleOrder(o.orderid)" class="w3-text-blue">Order #{{o.orderid}}&nbsp;&nbsp;<i class="fa fa-caret-down"></i></a>'+
		'<input type="button" @click ="startChat(o.customer)" :value="o.customer" class ="w3-btn w3-right w3-amber w3-medium w3-round" /></h3>' +
		'<div :id ="o.orderid" class ="w3-row">' +
		'<div id ="order" v-for ="m in o.meals" class ="w3-row">' +
			'<div id ="orderdetails" class ="w3-half w3-padding">' +
				'<div class ="w3-row">'+
				'<div class ="w3-col s6 w3-text-grey">Meal:</div>'+
				'<div class ="w3-col s6"><b>{{m.meal}}</b></div>' +
				'</div>'+
				'<div class ="w3-row">'+
				'<div class ="w3-col s6 w3-text-grey">Size:</div>'+
				'<div class ="w3-col s6">{{m.size}}</div>' +
				'</div>'+
				'<div class ="w3-row">'+
				'<div class ="w3-col s6 w3-text-grey">Extras:</div>'+
				'<div class ="w3-col s6"><span v-for ="e in m.extras" class ="w3-row">{{e}}</span></div>' +
				'</div>'+
				'<div class ="w3-row">'+
				'<div class ="w3-col s6 w3-text-grey">Note:</div>'+
				'<div class ="w3-col s6">{{m.note}}</div>' +
				'</div>'+
			'</div>' +
			'<div class ="w3-half w3-padding w3-center">' +
			//'<span class ="w3-circle w3-light-grey" style ="width: 150px; height: 130px;"></span>' +
			'<button id="progressbtn" class ="w3-btn w3-circle w3-text-white w3-border w3-border-amber" style ="width: 110px; height: 100px; background-color: rgb(32,0,32);">Preparing</button>'+
			'</div>' +
		'</div>' +
		'</div>' +
	'</div>' +
	//'<div id ="map" class ="w3-row" style ="height: 360px;"></div>' +
	'<div class ="w3-row w3-white w3-border" style ="">' +
		'<div class ="w3-row w3-padding w3-amber w3-center"><a href ="javascript:void(0)" @click="toggleChat" style="height: 100%; width: 100%; display: block">Chat: <b>{{receiver}}</b></a></div>' +
		'<div id ="chatbox" class="w3-row w3-hide">' +
		'<div id ="chatmsgs" class ="w3-row w3-white w3-border chatspace" style="height: 260px;">' +
		//'Ovwe herree'+
		//'cbhillin n buildimng' +
		'</div>' +
		'<div class ="w3-row w3-light-grey">' +
		'<input v-model = "reply" type = "text" class ="w3-input w3-col s9 w3-border" />' +
		'<input type ="button" value ="Send" @click ="sendMessage" class ="w3-btn w3-col s3 w3-blue" />' +
		'</div>' +
		'</div>'+
	'</div>' +
	'</div>';

Vue.component('store-dash',{
	props: ["type"],
	data: function(){
		return {
			message: "none",
			reply: "",
			orders: [],
			receiver: "",
			queued: []
		}
	},
	mounted: function(){
		this.$nextTick(this.connectToServer);
	},
	methods: {
		connectToServer: function(){
			jQuery.ajax({type:"GET",url:"../market.php",data:{qry:"meals"}}).done(this.displayOrder);
		},
		displayOrder: function(data){
			var rtxt = jQuery.parseJSON(data);

			if(rtxt != null)
			{
				//alert(rtxt.meals[09].meal);
				this.orders.push(rtxt);
			}
		},
		getOrders: function(){
			for(var c =0; c < this.queued.length; c++)
			{
				jQuery.ajax({type:"GET",url:"../orders.php",data:{qry:"new",id:this.queued[c]}}).done(this.displayOrder);
			}
			this.queued = [];
		},
		resolveRequest: function(answer){
			answerRequest(answer);
			//this.getOrders();
		},
		startChat: function(user){
			this.receiver = user;
			if(jQuery("#chatbox").hasClass("w3-hide") != false)
				jQuery("#chatbox").removeClass("w3-hide");
		},
		sendMessage: function(){
			sendMessage(this.reply);
			this.reply = "";  
		},
		toggleOrder: function(id){
			if(jQuery("#" + id).hasClass("w3-hide") == false)
				jQuery("#" + id).addClass("w3-hide");
			else
				jQuery("#" + id).removeClass("w3-hide");
		},
		toggleChat: function(){
			if(jQuery("#chatbox").hasClass("w3-hide") == false)
				jQuery("#chatbox").addClass("w3-hide");
			else
				jQuery("#chatbox").removeClass("w3-hide");
		}
	},
	template: dash
})