const extpay = ExtPay('bnifpmedbhipajiejffnihgcpknknjoo') ;


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
function getPostsfromGroup(group_id, access_token, limitTime) {
console.log("Inside getPostsfromGroup");
	const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node = "/" + group_id + "/feed?fields=link,caption,message,message_tags,created_time.summary(true),comments.summary(true).limit(50){message},reactions.limit(0).summary(true)&access_token=";
	//var feed = "?fields=message,id,likes.limit(0).summary(total_count)";
	//var parameters = "/?limit=100&access_token=" + access_token;
	var base_url = base + node + access_token; 
	console.log("base_url is : " + base_url);
	xhr.open('GET', base_url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send(null);

	xhr.onreadystatechange = () => {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		var objUsersIdPosts = new Map();
		var dataLoad = []
		dataLoad = JSON.parse(xhr.responseText);
		
		objUsersIdPosts = getDataLoad(dataLoad);

	var jqueryScript = document.createElement('script');
	jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
	script.type = 'text/javascript';
	document.body.appendChild(jqueryScript);
	
	var divScreen = document.createElement('div');
 	let modal = `
 	<img src="/icons/Repostre.jpg"  style="float:left;" />
	<h3 class="title" >Repostre
		<img src="/icons/settings.jpg"  style="float:right;" />
		<img src="/icons/help.png"  style="float:right;" />

		</h3>
	<hr>
	<div class="col-lg-10 col-lg-offset-2">
		<h4 class="filter"> Filter By     
		<img src ="/icons/like.png" onclick="sortPostsbyLikes();" align="right" />
		<img src ="/icons/comment.png" onclick="sortPostsbyComments();" align="right" />
		</h4>
	</div>
	 `
	divScreen.innerHTML = modal ; 
	document.body.appendChild(divScreen);

	var styleSheet = document.createElement('style');
	let styleModal = `
	style type="text/css">

		/* width */
		::-webkit-scrollbar {
		width: 20px;
		}

		/* Track */
		::-webkit-scrollbar-track {
		box-shadow: inset 0 0 5px grey; 
		border-radius: 10px;
		}
		
		/* Handle */
		::-webkit-scrollbar-thumb {
		background: red; 
		border-radius: 10px;
		}

		/* Handle on hover */
		::-webkit-scrollbar-thumb:hover {
		background: #b30000; 
		}
		body {
			background: #EFEFEF;
			width: 400px;
			height : 800 px;
		}

		.title {
			text-align: center;
		}

		.button {
			cursor: pointer;
			text-align: center;
			padding: 3px 3px;
			font-family: sans-serif;
			font-size: 1.2em;
			margin-top: 1px;
		}

		.button:hover {
			background: #A9A9A9;
		}	
	</style>
	`
	styleSheet.innerHTML = styleModal;
	document.body.appendChild(styleSheet);
		
	
	console.log("objUsersIdPosts.length() : "+objUsersIdPosts.size);
		for (let [key, value] of objUsersIdPosts) {
			
			console.log(key + " = " + value);
			var divPost = document.createElement('div');
			divPost.className = 'border pad';
			divPost.innerHTML = value[0];
			var divLikeCommentCount = document.createElement('div');
			divLikeCommentCount.className = 'border pad';
			var likeCount = value[1];
			var commentCount = value[2];
			let likeCommentModal = `
			<img src ="/icons/reactions.png"/> 
			<span id="likeCountId"></span>
			<img src ="/icons/comment.png"/> 
			<span id="commentCountId"></span>
			`
		
			divLikeCommentCount.innerHTML=likeCommentModal;
			divPost.appendChild(divLikeCommentCount);

			
			
			if(document.getElementById("likeCountId").innerHTML !== null && document.getElementById("commentCountId").innerHTML !==null){
				console.log("into this if!");
				
			document.getElementById("likeCountId").innerHTML = likeCount;
			document.getElementById("commentCountId").innerHTML = commentCount;
			console.log(document.getElementById("likeCountId").innerHTML);
			console.log(document.getElementById("commentCountId").innerHTML);
			} 
			
		if(divPost.innerHTML !== undefined && divPost.innerHTML !== null){
			document.body.appendChild(divPost);
			}
		}
		

	}
	};
};



document.addEventListener('DOMContentLoaded', async () => {
	
	if(document.getElementById("clickMe") !== "undefined" && document.getElementById("clickMe") !== null){
	document.getElementById("clickMe").onclick = function fun(){
	
		extpay.openTrialPage("3 days");
		extpay.onTrialStarted;
	}}
	if(document.getElementById("license") !== "undefined" && document.getElementById("license") !== null){
	document.getElementById("license").onclick = function licensefun(){
		extpay.openPaymentPage();
		
	}}

	extpay.getUser().then(user => {
    if (user.paid) {
		console.log("You're paid!");
		document.write('<a href = "popup.html"></a>');
		console.log("testing!!");
		var access_token = "EAARExoIYazcBAKxFz7DjGzAa0TbjjlAQuldQKmvB7CWPI0hComYJRgSgV5dZCUdtdP4toOio6bcnRtR0o6ySML2CtZCFIAjjghfN4AY2IZCiE8RNbxUiqwlOUCBExND6LyX5oRN4XN2iX6ZBbiIzBNRlfmC8fYVrQPGcvYbWHLGm1adQazrBHFr53AdnEgQMHvDoE0snOgZDZD";
		var limitTime = "31536000000";
		chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
		function (tabs) {
		console.log(tabs[0].url.substring(32, 48));
			var groupID = tabs[0].url.substring(32, 48);
			getPostsfromGroup(groupID, access_token, limitTime);
		}
	);


    }
	 else if (user.subscriptionStatus === 'past_due') {
		document.querySelector('p').innerHTML ="You need to update your card! Click here to update : ";
		var dueLink = document.createElement('a');
		document.body.appendChild(dueLink);
		document.getElementById("dueLink").onclick = function duefun(){
 		extpay.openPaymentPage();
		} 
        console.log("You need to update your card!");
       
    } else if (user.subscriptionCancelAt && user.subscriptionCancelAt < new Date()) {
		document.querySelector('p').innerHTML = "Your subscription will cancel soon. ";
        console.log("Your subscription will cancel soon.")
    } else if (user.subscriptionStatus === 'canceled') {
		document.querySelector('p').innerHTML = "We hope you enjoyed your subscription!"
        console.log("We hope you enjoyed your subscription!")
    } else {
		document.querySelector('p').innerHTML ="You haven't paid yet :(";
        console.log("You haven't paid yet :( ")
    }


	}).catch(err => {

   document.querySelector('p').innerHTML = err;
	})


});


function hideSpinner() {
	$('#divLoading').fadeOut(250, function () {
		$('#divLoading').removeClass('show');
	});
}
function showSpinner() {
	$('#divLoading').fadeIn(250, function () {
		$('#divLoading').addClass('show');
	});
}

function request_until_succeed(url) {
	var max_attempts = 3;
	var attempts = 0;
	var success = False;
	while (success == False && attempts < max_attempts) {
		attempts = attempts + 1;
		response = requests.get(url)
		if (response.status_code == 200) {
			success = True;
		} else {
			// window.alert('Error for URL {'+&url + '} | {' + &datetime.datetime.now() +'} | attempt {' + &attempts +'} of {' +max_attempts +'}');
			if (attempts == max_attempts) {
				//  raise Exception('Failed after {} attempts | {}'.format(attempts, url))
				window.alert("Failed after many attempts");
			}
		}
		return response;
	}


	//var data = request_until_succeed(url).json()

	return data;

}

function sortPostsbyLikes(group_id) {
	const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node_likes = "/" + group_id + "/feed?fields=link,caption,message,message_tags,reactions.limit(0).summary(true),comments.summary(true).limit(50){message},created_time&access_token=";
	var access_token = "EAARExoIYazcBAKxFz7DjGzAa0TbjjlAQuldQKmvB7CWPI0hComYJRgSgV5dZCUdtdP4toOio6bcnRtR0o6ySML2CtZCFIAjjghfN4AY2IZCiE8RNbxUiqwlOUCBExND6LyX5oRN4XN2iX6ZBbiIzBNRlfmC8fYVrQPGcvYbWHLGm1adQazrBHFr53AdnEgQMHvDoE0snOgZDZD";
	//var parameters = "?access_token=" + access_token;
	var base_url = base + node_likes + access_token; 

	console.log("base_url for likes is : " + base_url);
	xhr.open('GET', base_url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send(null);

	xhr.onreadystatechange = () => {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		var objUsersIdPosts = new Map();
		objUsersIdPosts = getDataLoad(xhr.responseText);

		for (let [key, value] of objUsersIdPosts) {
			
			console.log(key + " = " + value);
			var divPost = document.createElement('div');
			divPost.className = 'border pad';
			divPost.innerHTML = value;
			if(divPost.innerHTML !=="undefined" && divPost.innerHTML !== null){
			document.body.appendChild(divPost);
			}
		}

	};


}
}



function sortPostsbyComments(group_id) {
		const xhr = new XMLHttpRequest();
	var base = "https://graph.facebook.com"
	var node_comments = "/" + group_id + "/feed?fields=link,caption,message,message_tags,comments.summary(true).limit(50){message},reactions.limit(0).summary(true),created_time&access_token=";
	var access_token = "EAARExoIYazcBAKxFz7DjGzAa0TbjjlAQuldQKmvB7CWPI0hComYJRgSgV5dZCUdtdP4toOio6bcnRtR0o6ySML2CtZCFIAjjghfN4AY2IZCiE8RNbxUiqwlOUCBExND6LyX5oRN4XN2iX6ZBbiIzBNRlfmC8fYVrQPGcvYbWHLGm1adQazrBHFr53AdnEgQMHvDoE0snOgZDZD";
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
			
			console.log(key + " = " + value);
			var divPost = document.createElement('div');
			divPost.className = 'border pad';
			divPost.innerHTML = value;
			if(divPost.innerHTML !=="undefined" && divPost.innerHTML !== null){
			document.body.appendChild(divPost);
			}
		}

	};



}

}
