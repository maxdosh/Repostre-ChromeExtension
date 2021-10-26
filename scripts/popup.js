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
					objMap.set(dataLoad.data[i].id,[dataLoad.data[i].message,dataLoad.data[i].reactions.summary.total_count,dataLoad.data[i].comments.summary.total_count]);
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






function getPostsfromGroup(group_id, access_token) {
	
console.log("Inside getPostsfromGroup");

	const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node = "/" + group_id + "/feed?fields=link,caption,message,message_tags,created_time.summary(true),comments.summary(true).limit(50){message},reactions.limit(0).summary(true)&access_token=";
	var base_url = base + node + access_token; 
	console.log("base_url from groups is : " + base_url);
	xhr.open('GET', base_url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send(null);
	 objUsersIdPosts = new Map();
	xhr.onreadystatechange = () => {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		
		var dataLoad = []
		dataLoad = JSON.parse(xhr.responseText);
		 objUsersIdPosts = getDataLoad(dataLoad);
		
	
	for (let [key, value] of objUsersIdPosts) {
			
	console.log(key + " = " + value);

	 	const li = document.createElement("li");
		const listDiv = document.createElement("div");
		if(value[0] !== "undefined" && value[0] !== null && value[0] !== undefined){
		listDiv.innerHTML= value[0];
		const listText = document.createElement("div");
		var img1 = document.createElement('img');
		img1.src ='/icons/reactions.png';
		var span1 = document.createElement('span');
		span1.innerHTML = value[1];
		var img2 = document.createElement('img');
		img2.src='/icons/comment2.png';
		var span2= document.createElement('span');
		span2.innerHTML = value[2];
		listText.appendChild(img1);
		listText.appendChild(span1);
		listText.appendChild(img2);
		listText.appendChild(span2);	
		var hr = document.createElement("HR");
		listText.appendChild(hr);

		listDiv.appendChild(listText);
		li.appendChild(listDiv);

			
		document.querySelector("ul").appendChild(li);
		}
			}
			console.log("objUsersIdPosts size 1: "+objUsersIdPosts.size);
			return objUsersIdPosts;
};

}

}

function getPostsFromPage(pageID, access_token){

	console.log("Inside getPostsfromGroup");
	const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node = "/" + pageID + "/feed?fields=link,caption,message,message_tags,created_time.summary(true),comments.summary(true).limit(50){message},reactions.limit(0).summary(true)&access_token=";
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
		const listDiv = document.createElement("div");
		if(value[0] !== "undefined" && value[0] !== null && value[0] !== undefined){
		listDiv.innerHTML= value[0];
		const listText = document.createElement("div");
		var img1 = document.createElement('img');
		img1.src ='/icons/reactions.png';
		var span1 = document.createElement('span');
		span1.innerHTML = value[1];
		var img2 = document.createElement('img');
		img2.src='/icons/comment.png';
		var span2= document.createElement('span');
		span2.innerHTML = value[2];
		listText.appendChild(img1);
		listText.appendChild(span1);
		listText.appendChild(img2);
		listText.appendChild(span2);	
		
		
		listDiv.appendChild(listText);
		li.appendChild(listDiv);

			
		document.querySelector("ul").appendChild(li);
		}
			}
};


}
}


function sortPostsbyLikes(groupID, access_token, results) {
console.log("Inside sortPostsbyLikes"); 
 
for (let [key, value] of results) {
	
	console.log(key + " = " + value);
}
}




document.addEventListener('DOMContentLoaded',  () => {

console.log("testing!!");
	var access_token = "EAAOZBItChqO0BAGxn2I0f93lZAdoFS0an5jjt71NXeLZCEJPUAX2UdqVCYpEbIM0XyYM4T5P9hYCeiH6nwNdZA0MDooRdFpoV0kCMU2VUnMlXmtdcBZA64bPosGZB6nwLNNAoGZCAZBNM7dsuCmeLqKbge5zETMo32NoXbjpUr3jVZCZA0Wvbg1v4J";
		var limitTime = "31536000000"; var groupID; var results = new Map();
		chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
		function (tabs) {
			if(tabs[0].url.indexOf('groups') !== -1){
			console.log("into groups");
			 groupID = tabs[0].url.substring(32, 48);
			
		//	var likesBoolean = 0; var commentsBoolean = 0; 
			
			
		 results = getPostsfromGroup(groupID, access_token);
		console.log("results size : "+results.size);
	for (let [key, value] of results) {
		console.log("results here in Main : "+value);
		}
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
		
		document.getElementById('likesLink').addEventListener('click', function() {
			 console.log("Likes are clicked now!!!!");
			 var likesBoolean = "1"; var commentsBoolean = "0" ;
			 sortPostsbyLikes(groupID,access_token, results);
			});
	
			
});


	






function sortPostsbyComments(group_id) {
const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node_comments = "/" + group_id + "/feed?fields=link,caption,message,message_tags,comments.summary(true).limit(50){message},reactions.limit(0).summary(true),created_time&access_token=";
	var access_token = "EAADQ04J7kUsBAFNIDeet7n9EATEXv2qbZCKBUWtJkjYxcW6B5fid1MnozExoEl25pKjZBBfyydqjO0f6UXwwLZBgwdEBbcTlGMEU7UisJ3iQHkyHpeI9uOIkGVdTQ825jLqrnordbrxWAa2WZAPuVXkPhO27PtMtGcT4TbUgiQZDZD";
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




