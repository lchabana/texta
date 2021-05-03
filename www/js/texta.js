const CREDS = "creds";
const MSGS = "msgs_";

  /*"cordova-plugin-filepickerio":{
    "from":["www","filepickerio.js"],
    "to":["js","filepickerio.js"]
  }*/
function showHelp()
{
	jQuery("main *").css({"visibility":"hidden","display":"none"});
}

function getAppId()
{
	var storeObj = window.localStorage;

	var id = storeObj.getItem("appid");

	if(id == null)
	{
		var dt = new Date();
		var ran = Math.floor(Math.random() * 100000);
		var duuid = device.uuid;
		id = sha256(ran + duuid + dt);
		storeObj.setItem("appid",id);
	}
	
	return id;
}

function openScreen(screen){
    jQuery("#main > div").css({"visibility":"hidden","display":"none"});
    if(jQuery("#" + screen).hasClass("w3-hide"))
        jQuery("#" + screen).removeClass("w3-hide");
    jQuery("#main #" + screen).css({"visibility":"visible","display":"block"});
}

function setUserInfo(name,phone)
{
	
	var info_db = new SQLite('db/mydata.db');
	var storeObj = window.localStorage;
	var inf = getUserInfo();
	if(inf.name == null || inf.phone == null)
	{
		var sk = sha256();
		storeObj.setItem("username",name);
		storeObj.setItem("phone",phone);
		storeObj.setItem("secretkey",id);

	}
}

//var SQLite = cordova.require("cordova-sqlite-plugin.SQLite");;
function getUserInfo()
{
	//SQLite = window.cordova.require("cordova-sqlite-plugin.SQLite");
	/*var info_db = new SQLite('db/mydata.db');
	
	info_db.open(function(err){
		if(err)
		{
			navigator.notification.alert("Couldn't find database");

		}
		else
		{
			info_db.query("INSERT INTO messages(from,message) Values(Kop,'get ahead')",function(err,res){
				if(err){
					navigator.notification.alert("Couldn't insert message");
				}
				else
				{
					navigator.notification.alert("message successfully added.");
				}
			});
		}
	});*/
	var storeObj = window.localStorage;

	var name = storeObj.getItem("username");
	var no = storeObj.getItem("phone");
	var key = storeObj.getItem("secretkey");
	
	return {"name":name,"phone":no,"key":key};
}

function readFromFile(ofile,friend,format)
{
	var msgs = "";
	var type = window.PERSISTENT;
	var size = 2 * 1024 * 1024;
	window.requestFileSystem(type,size, successCallback, errorCallback);

	/*function successCallback(fs) { 
      	fs.root.getFile('msgs_' + friend + '.txt', {create: true, exclusive: true}, function(fileEntry) { 
        	alert('File creation successfull!') 
    	}, errorCallback);
  	}*/
  	function successCallback(fs) { 
      	fs.root.getFile(ofile, {}, function(fileEntry) { 
         	fileEntry.file(handleFile, errorFileRead); 
      	}, errorCallback); 
   	}

   	function handleFile(file){
   		var reader = new FileReader(); 
      var mg = "";
    	reader.onloadend = function(e) { 
          this.mg = this.result;
          alert("Done reading: \n" + this.result);
    	};

      if(format != null && format == "text")
    	{
        reader.readAsText(file);
      }
      else if(format == "image")
      {
        reader.readAsArrayBuffer(file);
      }
      else if(format == "array")
      {}
      msgs = mg;
   	}
   	//function readerDone(e){}
   	function errorFileRead(err){
   		alert("Reading error: " + err.code);
   	}
  	function errorCallback(err){
  		alert("Couldn't open FileSystem: " + err.code);
  	}
  	return msgs;
}

function writeToFile(ofile,friend,message)
{
	var done = false;
	//window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	var type = window.PERSISTENT;
	var size = 2 * 1024 * 1024;
  // navigator.webkitPersistentStorage.requestQuota(size,function(){
  //       console.log('Persistent fs quota granted');
  // });
	window.requestFileSystem(type, size, successCallback, errorCallback);
	/*
	navigator.webkitPersistentStorage.requestQuota(size,changeBytes);
	function changeBytes(allowedBytes){
		//size = allowedBytes;
		//e.preventDefault();
	};
	function successCallback(fs) { 
		
      	fs.root.getFile('msgs_' + friend + '.txt', {create: true, exclusive: true}, function(fileEntry) { 
        	alert('File creation successfull!') 
    	}, errorCallback);
  	}*/
  	function successCallback(fs) { 
      	fs.root.getFile(ofile, {create: true, exclusive: true}, function(fileEntry) { 
         	fileEntry.createWriter(handleFile, errorCallback); 
      	}, errorCallback); 
   	}

   	function handleFile(filewriter){
   		var d = false; 
    	filewriter.onwriteend = function(e) { 
           this.d = true;
           alert("successful " + e.toString());
    	};
    	filewriter.onerror = function(e){
    		this.d = false;
    		alert("error: " + e.toString());
    	};

    	try{
    		filewriter.seek(filewriter.length);
    	}
    	catch(e)
    	{
    		alert(e);
    	}
      message += "\n";
      var msg_data = new Blob([message],{type:"text/plain"}); 
    	filewriter.write(msg_data);
      done = d;
   	}

  	function errorCallback(err){
  		alert("Couldn't open FileSystem: " + err.code);
  	}
  	return done;
}