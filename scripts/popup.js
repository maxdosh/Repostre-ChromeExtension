//const extpay = ExtPay('bnifpmedbhipajiejffnihgcpknknjoo') ;


function getFacebookPageFeedUrl(base_url) {


	var fields = "&fields=message,link,created_time,updated_time,type," +
		"from";
	var url = base_url + fields

	return url;
}

function formatDateTime(dateStr) {
	var year, month, day, hour, minute, dateUTC, date, ampm, d, time;
	var iso = (dateStr.indexOf(' ') == -1 && dateStr.substr(4, 1) == '-' && dateStr.substr(7, 1) == '-' && dateStr.substr(10, 1) == 'T') ? true : false;

	year = dateStr.substr(0, 4);
	month = parseInt((dateStr.substr(5, 1) == '0') ? dateStr.substr(6, 1) : dateStr.substr(5, 2)) - 1;
	day = dateStr.substr(8, 2);
	hour = dateStr.substr(11, 2);
	minute = dateStr.substr(14, 2);
	dateUTC = Date.UTC(year, month, day, hour, minute);
	date = new Date(dateUTC);
	var curDate = new Date();

	var currentStamp = curDate.getTime();
	var datesec = date.setUTCSeconds(0);
	var difference = parseInt((currentStamp - datesec) / 1000);
	return difference;
}




function getObjs(dataLoad, objMap) {
	console.log("dataLoad.data from getObjs:  "+dataLoad.data);
	if (typeof dataLoad.data !== "undefined" && dataLoad.data !== null) {
		for (var i = 0; i <= dataLoad.data.length - 1; i++) {
			//if (formatDateTime(dataLoad.data[i].created_time) <= limitTime || formatDateTime(dataLoad.data[i].updated_time) <= limitTime) {
				//if (typeof dataLoad.data[i].from !== "undefined" && dataLoad.data[i].from !== null) {
					//console.log(formatDateTime(dataLoad.data[i].created_time) + " second -> OK | " + dataLoad.data[i].from.name + " | " + dataLoad.data[i].from.id + " | " + dataLoad.data[i].id + " | 3");
					//obj[0].push(dataLoad.data[i].id);
					objMap.set(dataLoad.data[i].id,[dataLoad.data[i].message,dataLoad.data[i].reactions.summary.total_count,dataLoad.data[i].comments.summary.total_count, dataLoad.data[i].created_time]);
				//}
			//}
		}
		console.log("objMap: "+objMap);
	}
	return objMap;
}


function getDataGraph(url){
          var dataLoadNext = [];
		  const xhr = new XMLHttpRequest();
		  xhr.open('GET', url, true);
		  xhr.setRequestHeader('Accept', 'application/json');
		  xhr.send(null);
		  	xhr.onreadystatechange = () => {
	if (xhr.readyState === XMLHttpRequest.DONE) {

		var dataLoadNext = JSON.parse(xhr.responseText);
		};
	};

	return dataLoadNext;
}

function getDataLoad(dataLoad){

		   const objMap = new Map(); var objUsersIdPosts = new Map();
		
	// 		console.log("objUsersIdPosts1 : "+objUsersIdPosts);
		var dataLoadNext = []; 
		if (typeof dataLoad.data !== "undefined" && dataLoad.data !== null) {
			  objUsersIdPosts = getObjs(dataLoad, objMap);
					
					if(dataLoad.paging.next && dataLoad.paging.next.data !== null){
						console.log("dataLoad.paging.next: "+dataLoad.paging.next);
					dataLoadNext = getDataGraph(dataLoad.paging.next);
					
					}
					console.log("dataLoadNext: "+dataLoadNext); 
					if(dataLoadNext !=="undefined" && dataLoadNext.data !== null){
					 objUsersIdPosts = getObjs(dataLoadNext, objUsersIdPosts);
					}
				//};
			
			
		}

		return objUsersIdPosts;
}


function mycallback(data){
	console.log("into callback!!");
	console.log("data: "+data);
	var dataResult = new Map();
	dataResult = data;
	return dataResult;
}


function getPostsfromGroup(group_id, access_token) {
	
console.log("Inside getPostsfromGroup");

	const xhr = new XMLHttpRequest();objUsersIdPosts = new Map();
	var base = "https://graph.facebook.com"
	var node = "/" + group_id + "/feed?fields=link,caption,message,message_tags,created_time.summary(true),comments.summary(true).limit(50){message},reactions.limit(0).summary(true)&access_token=";
	var base_url = base + node + access_token; 
	console.log("base_url from groups is : " + base_url);
	
	

	
	xhr.onreadystatechange = () => {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		 
		var dataLoad = []
		dataLoad = JSON.parse(xhr.responseText);
		 objUsersIdPosts = getDataLoad(dataLoad);
	xhr.onload = function() {
		mycallback(objUsersIdPosts);
		}
		 
	for (let [key, value] of objUsersIdPosts) {
			
	console.log(key + " = " + value);

	 	const li = document.createElement("li");
		li.setAttribute("class","liClass")
		const listDiv = document.createElement("div");
		listDiv.setAttribute("class","wholeDiv");
		if(value[0] !== "undefined" && value[0] !== null && value[0] !== undefined){
		listDiv.innerHTML= value[0];
		const listText = document.createElement("div");
		var img1 = document.createElement('img');
		img1.src ='/icons/reactions.png';
		var span1 = document.createElement('span');
		span1.setAttribute("class","dataSort1");
		span1.innerHTML = value[1];
		var spanhidden = document.createElement('span');
		spanhidden.setAttribute("class","dataSort3");
		spanhidden.style.visibility= "hidden";
		spanhidden.style.display = "none";
		spanhidden.innerHTML = value[3];
		var img2 = document.createElement('img');
		img2.src='/icons/comment2.png';
		var span2= document.createElement('span');
		span2.setAttribute("class","dataSort2");
		span2.innerHTML = value[2];
		listText.appendChild(img1);
		listText.appendChild(span1);
		listText.appendChild(img2);
		listText.appendChild(span2);
		listText.appendChild(spanhidden);	
		var hr = document.createElement("HR");
		listText.appendChild(hr);

		listDiv.appendChild(listText);
		li.appendChild(listDiv);

			
		document.querySelector("ul").appendChild(li);
		}
			}
			
		
};

}
xhr.open('GET', base_url, true);
xhr.setRequestHeader('Accept', 'application/json');
xhr.send();

}

 function comparator(a, b) {
            if (a.dataset.subject < b.dataset.subject)
                return -1;
            if (a.dataset.subject > b.dataset.subject)
                return 1;
            return 0;
        }



function getPostsFromPage(pageID, access_token){

	console.log("Inside getPostsfromGroup");
	const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node = "/" + pageID + "/feed?fields=message,message_tags,created_time.summary(true),comments.summary(true).limit(100){message},reactions.limit(0).summary(true)&access_token=";
	var base_url = base + node + access_token; 
	console.log("base_url from Pages is : " + base_url);
	xhr.open('GET', base_url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send(null);

	xhr.onreadystatechange = () => {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		var objUsersIdPosts = new Map();
		var dataLoad = []
		dataLoad = JSON.parse(xhr.responseText);
		objUsersIdPosts = getDataLoad(dataLoad);

	console.log("objUsersIdPosts.length() : "+objUsersIdPosts.size);

	
	
	for (let [key, value] of objUsersIdPosts) {
			
	console.log(key + " = " + value);

	 	const li = document.createElement("li");
		li.setAttribute("class","liClass")
		const listDiv = document.createElement("div");
		listDiv.setAttribute("class","wholeDiv");
		if(value[0] !== "undefined" && value[0] !== null && value[0] !== undefined){
		listDiv.innerHTML= value[0];
		const listText = document.createElement("div");
		var img1 = document.createElement('img');
		img1.src ='/icons/reactions.png';
		var span1 = document.createElement('span');
		span1.setAttribute("class","dataSort1");
		span1.innerHTML = value[1];
		var spanhidden = document.createElement('span');
		spanhidden.setAttribute("class","dataSort3");
		spanhidden.style.visibility= "hidden";
		spanhidden.style.display = "none";
		spanhidden.innerHTML = value[3];
		var img2 = document.createElement('img');
		img2.src='/icons/comment2.png';
		var span2= document.createElement('span');
		span2.setAttribute("class","dataSort2");
		span2.innerHTML = value[2];
		listText.appendChild(img1);
		listText.appendChild(span1);
		listText.appendChild(img2);
		listText.appendChild(span2);
		listText.appendChild(spanhidden);	
		var hr = document.createElement("HR");
		listText.appendChild(hr);

		listDiv.appendChild(listText);
		li.appendChild(listDiv);

			
		document.querySelector("ul").appendChild(li);
		}
			}
};


}
}

 function formatDate(date){

    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if(dd<10) {dd='0'+dd}
    if(mm<10) {mm='0'+mm}
    date = mm+'/'+dd+'/'+yyyy;
    return date
 }





document.onreadystatechange = function () {
	console.log("document state :"+document.readyState);
if (document.readyState === 'complete') {
  // The page is fully loaded
console.log("testing!!  ");
	var access_token = "EAAOZBItChqO0BAIUjItR21o0OwDkj34H0rdvaxn3BIKYcDi7CUN2wjHvQ4ofhcnpyh9qphKsvQygYclBuXt8COFujz197cK0CVB92rWyRgpNcUzjpwiX2IvPunOgyB9cWJ5gyYLFZAMkoaZCr4kT0uNgGAPnNy1WWTf6AFtzRZBYuFZC1xGo4fuOewtqkX8v4o3JW2lwIak3gB8KQWt4EbLqZA7OjPqa6ppQBIaLYkMGrbQVFGYPf0";
	console.log("Below access-token!!");
		var limitTime = "31536000000"; var groupID; var results = new Map();
		console.log("below variable def!! :" +chrome.tabs.getCurrent);

		chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
		function (tabs) {
			console.log("before checking tabs!!: "+tabs[0].id);
			if(tabs[0].url.indexOf('groups') !== -1){
			console.log("into groups");
			 groupID = tabs[0].url.substring(32, 48);
			
		//	var likesBoolean = 0; var commentsBoolean = 0; 
			
			
			 getPostsfromGroup(groupID, access_token);
	
			}
			else if(tabs[0].url.indexOf('profile') !== -1){
				console.log(tabs[0].url.indexOf('profile'));
				console.log("into profiles!!");
			}
			else{
				console.log("into pages!!");
				var pageNameID = tabs[0].url.split('/')[3];
				var pageID = pageNameID.split('-').reverse()[0];
				console.log("pageID:" +pageID);
				getPostsFromPage(pageID,access_token);

			}
			
			 
		})
		
		
		
						//document.getElementById("likesID").addEventListener('click', function() {
			$('#likesID').click(function(){			
			
			 console.log("Likes are clicked now!!!!");
				var cont = $(".listContainer");
				var arr = $.makeArray(cont.children(".liClass"));
				
				arr.sort(function(a, b) {
  				var textA = +$(a).find(".dataSort1").text();
  				var textB = +$(b).find(".dataSort1").text();

  				if (textA > textB) return 1;
  				if (textA < textB) return -1;

  				return 0;
				});

				cont.empty();

				$.each(arr, function() {
    			cont.append(this);
				});
				
		
		});
		
		
		$('#commentsID').click(function(){			
			
			 console.log("Comments are clicked now!!!!"); 
				var cont = $(".listContainer");
				var arr = $.makeArray(cont.children(".liClass"));
				
				arr.sort(function(a, b) {
  				var textA = +$(a).find(".dataSort2").text();
  				var textB = +$(b).find(".dataSort2").text();

  				if (textA > textB) return 1;
  				if (textA < textB) return -1;

  				return 0;
				});

				cont.empty();

				$.each(arr, function() {
    			cont.append(this);
				});
				
		
		});
		
$('#days7id').click(function(){	
	console.log("7 days are clicked now!");
	
	var cont = $(".listContainer");
	var arr = $.makeArray(cont.children(".liClass"));
	var datesArr = [];

	for (var i=0; i<7; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        datesArr.push( d );

}
		$.each(arr, function() {
			console.log("datesArr[j] : "+datesArr[j]);
			var textA = $(this).find(".dataSort3").text();
			var textB = $(this).next().find(".dataSort3").text();
			
			if (textA > textB) return 1;
  				if (textA < textB) return -1;

  				return 0;
		});

for(var j=0; j<7; j++) {
	
		var textAA = $(arr[j]).find(".dataSort3").text();
		if(datesArr[j] == textAA){
			return 1;
		}

		else return -1;
		
		return 0;
		}
    
	
	cont.empty();
	
	$.each(arr, function() {
    			cont.append(this);
				});
	});



$('#days30id').click(function(){	
	console.log("30 days are clicked now!");
	
	var cont = $(".listContainer");
	var arr = $.makeArray(cont.children(".liClass"));
	var datesArr = [];

	for (var i=0; i<30; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        datesArr.push( d );

}

		$.each(arr, function() {
			console.log("datesArr[j] : "+datesArr[j]);
			var textA = $(this).find(".dataSort3").text();
			var textB = $(this).next().find(".dataSort3").text();
			
			if (textA > textB) return 1;
  				if (textA < textB) return -1;

  				return 0;
		});

for(var j=0; j<30; j++) {
	
		var textAA = $(arr[j]).find(".dataSort3").text();
		if(datesArr[j] == textAA){
			return 1;
		}

		else return -1;
		
		return 0;
		}
    
	
	cont.empty();
	
	$.each(arr, function() {
    			cont.append(this);
				});
	
	});
	
$('#months3id').click(function(){
	
		console.log("3 months is clicked now!");
	
	var cont = $(".listContainer");
	var arr = $.makeArray(cont.children(".liClass"));
	var datesArr = [];

	for (var i=0; i<90; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        datesArr.push( d );

}

		$.each(arr, function() {
			console.log("datesArr[j] : "+datesArr[j]);
			var textA = $(this).find(".dataSort3").text();
			var textB = $(this).next().find(".dataSort3").text();
			
			if (textA > textB) return 1;
  				if (textA < textB) return -1;

  				return 0;
		});

for(var j=0; j<90; j++) {
	
		var textAA = $(arr[j]).find(".dataSort3").text();
		if(datesArr[j] == textAA){
			return 1;
		}

		else return -1;
		
		return 0;
		}
    
	
	cont.empty();
	
	$.each(arr, function() {
    			cont.append(this);
				});	
	
	});
	
$('#months6id').click(function(){	
	
	console.log("6 months is clicked now!");
	
	var cont = $(".listContainer");
	var arr = $.makeArray(cont.children(".liClass"));
	var datesArr = [];

	for (var i=0; i<180; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        datesArr.push( d );

}

		$.each(arr, function() {
			console.log("datesArr[j] : "+datesArr[j]);
			var textA = $(this).find(".dataSort3").text();
			var textB = $(this).next().find(".dataSort3").text();
			
			if (textA > textB) return 1;
  				if (textA < textB) return -1;

  				return 0;
		});

for(var j=0; j<180; j++) {
	
		var textAA = $(arr[j]).find(".dataSort3").text();
		if(datesArr[j] == textAA){
			return 1;
		}

		else return -1;
		
		return 0;
		}
    
	
	cont.empty();
	
	$.each(arr, function() {
    			cont.append(this);
				});	
	
	
	});
	
$('#yearid').click(function(){	
	console.log("1 year is clicked now!");
	
	var cont = $(".listContainer");
	var arr = $.makeArray(cont.children(".liClass"));
	var datesArr = [];

	for (var i=0; i<365; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        datesArr.push( d );

}

		$.each(arr, function() {
			console.log("datesArr[j] : "+datesArr[j]);
			var textA = $(this).find(".dataSort3").text();
			var textB = $(this).next().find(".dataSort3").text();
			
			if (textA > textB) return 1;
  				if (textA < textB) return -1;

  				return 0;
		});

for(var j=0; j<365; j++) {
	
		var textAA = $(arr[j]).find(".dataSort3").text();
		if(datesArr[j] == textAA){
			return 1;
		}

		else return -1;
		
		return 0;
		}
    
	
	cont.empty();
	
	$.each(arr, function() {
    			cont.append(this);
				});	
	
	
	});
	

		
console.log("document.readyState 2 : "+document.readyState);

}
}

function sortPostsbyComments(group_id) {
const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node_comments = "/" + group_id + "/feed?fields=link,caption,message,message_tags,comments.summary(true).limit(50){message},reactions.limit(0).summary(true),created_time&access_token=";
	var access_token = "EAAZBfUsZCV6MQBAIQ0mAS3A6zmhZAGuIEytfaeAj1wpALH9NZAZCrrMiTbfpUBe9mXcecrzqFCzIEZC5TPZAGILflz75jsW6r0YLbgkUO7XZCRdTtQwIPLInSuzi5SLMIObBfUVR1KananUL2cvn4CvpvxuqAN3nkLlVJ1izVm9NjWQZBu1QktGmF2jzpm8JVFTUZD";
	//var parameters = "?access_token=" + access_token;
	var base_url = base + node_comments + access_token; 

	console.log("base_url for comments is : " + base_url);
	xhr.open('GET', base_url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send(null);

	xhr.onreadystatechange = () => {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		var objUsersIdPosts = new Map();
		objUsersIdPosts = getDataLoad(xhr.responseText);

		for (let [key, value] of objUsersIdPosts) {
			
		divPost.innerHTML = value[0];


		}
	}


};
}




