//(function() {
			  // Initialize Firebase
			  var config = {
				apiKey: "AIzaSyBxIPdeGPLqs1BMGDjdVb_NGIggAskpT0s",
				authDomain: "test-907e1.firebaseapp.com",
				databaseURL: "https://test-907e1.firebaseio.com",
				projectId: "test-907e1",
				storageBucket: "",
				messagingSenderId: "119635730149"
			  };
			  firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = 'pt';


const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");
const btnLogin = document.getElementById("btnLogin");
const btnSignUp = document.getElementById("btnSignUp");
const btnTEST = document.getElementById("btnTEST");
const txtName = document.getElementById("txtName");
const txtMessage = document.getElementById("txtMessage");
const btnUpdateName = document.getElementById("btnUpdateName");

var mess;
btnLogin.addEventListener('click', e => {
	firebase.auth().signInWithRedirect(provider);
});
var userID;
btnSignUp.addEventListener('click', e => {
	const email = txtEmail.value;
	const pass = txtPassword.value;
	const auth = firebase.auth();
	const promise = auth.createUserWithEmailAndPassword(email,pass);;
	promise.catch(e => {
		console.log(e.messsage)
		$(document).ready(function(){
			$("#logFailedAlert").slideDown().delay("100").slideUp();
		});
	});
});

const refObj = firebase.database().ref();
//const refObjCodes = firebase.database().ref().child("users_codes");
const uploadedAlert = document.getElementById("uploadedAlert");
var code;
function uploadCode(){
	var arrOfVal = window.location.search.substring(1).split("&");
	console.log(arrOfVal);
	for(var i =0; i!=arrOfVal.length; i++){
		var KandV = arrOfVal[i].split("=");
		if(KandV[0]=="code"){
			console.log(KandV[1]);
			code = KandV[1];
			console.log(userID);
			console.log("# of keys: "+numOfKeys );
			if(userID != null){
					refObj.child("users_codes").child(userID).once("value", e =>{
						//console.log(e.val()[code]);
						console.log(e.exists());
						if(!e.exists()||e.val()[code]==null){
							console.log("RAN");
							refObj.child("users_codes").child(userID).update({
							[code]:true
							//["testing"+(numOfKeys+1)]:code
							});
							//sucess, code added to account

							$(document).ready(function(){
								$("#notSignedInAlert").slideUp();
								$("#uploadedAlert").slideDown().delay("3000").slideUp();
							});
						}else{
							$(document).ready(function(){
								$("#notSignedInAlert").slideUp();
								$("#alreadyScannedAlert").slideDown().delay("3000").slideUp();
							});
						}
					});
			}else{
				$(document).ready(function(){
					$("#notSignedInAlert").fadeIn();
				});
				console.log("Update blocked due to lack of userID");
				NoUID = true;
			}
		}
	}

}

document.getElementById("signOutLink").onclick = function(){
	console.log("Sign out");
	firebase.auth().signOut();
};
var NoUID = false;
var numOfKeys=0;
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			console.log(firebaseUser);
			txtEmail.value = firebaseUser.email;
			document.getElementById("signedInP").style.display = "inline";
			document.getElementById("signedInP").style.fontSize = "x-small";
			document.getElementById("insertNameHere").innerHTML = firebaseUser.email;
			document.getElementById("signInForm").style.display = "none";
			document.getElementById("updateInfoForm").style.display = "block";
			document.getElementById("welcomeMessageOnJumbo").innerHTML = "You are now signed in!";
			$(document).ready(function(){
				$("#jumbo").slideUp();
			});
			userID = firebaseUser.uid;
			if(NoUID){
				uploadCode()
			}
		}else{
			console.log("not logged in!");
			document.getElementById("signedInP").style.display = "none";
			document.getElementById("signInForm").style.display = "block";
			document.getElementById("updateInfoForm").style.display = "none";
			document.getElementById("jumbo").style.display = "block";
		}

	});
	var first = true;

refObj.child("users").on("value", e =>{
				console.log("SERVER UPDATED\n"+e.child(userID));
				console.log(e.val());
				//parse data
				var ppls = [];
				var num = 0;
				for(var prop in e.val()){
					if (e.val().hasOwnProperty(prop)) {
							ppls.push({});
							for(var propT in e.val()[prop]){
								if (e.val()[prop].hasOwnProperty(propT)) {
									if(propT == "Name"){
										ppls[num].name = e.val()[prop][propT];
									}else if(propT == "Message"){
										ppls[num].message = e.val()[prop][propT];
									}else if(propT == "numOfCodes"){
										ppls[num].numOfKeys = e.val()[prop][propT];
									}
								}
							}
							if (ppls[num].numOfKeys == null){
								ppls[num].numOfKeys = 0;
							}
						if(prop == userID){
							console.log(prop);
							numOfKeys = ppls[num].numOfKeys;
							if(ppls[num].numOfKeys==null){
								document.getElementById("insertNumberOfCodesHere").innerHTML = "";
							}else{
								document.getElementById("insertNumberOfCodesHere").innerHTML = ppls[num].numOfKeys;
							}

							if(ppls[num].name != null){
								txtName.value = ppls[num].name;
							}
							if(ppls[num].message != null){
								txtMessage.value = ppls[num].message;
							}
							ppls[num].user = true;
							if(ppls[num].name == null || ppls[num].message == null){
								$(document).ready(function(){
									$("#NoNameMessage").slideDown().delay("6000").slideUp();
								});
							}
						}
						num++;
					}
				}
				console.log(ppls);

				//Upload code
				if(first){
					first=false;
					uploadCode();
				}

				//Order List
				   for (var i = 1; i < ppls.length; i++)
				   {
					var keyarr = ppls[i]
				       var j = i-1;

				       while (j >= 0 && ppls[j].numOfKeys < keyarr.numOfKeys)
				       {
				           ppls[j+1] = ppls[j];
				           j--;
				       }
				       ppls[j+1] = keyarr;
				   }
				console.log(ppls);
				const table = document.getElementById("myTable");
				console.log(table.rows.length);
				while(table.rows.length > 2){
					table.deleteRow(-1);
				}
				var oldNumOfKeys = -1;
				var rank = 0;
				for (var i = 0; i < ppls.length; i++){

					const row = table.insertRow(-1);
					const cell0 = row.insertCell(0);
   					const cell1 = row.insertCell(1);
    				const cell2 = row.insertCell(2);
					const cell3 = row.insertCell(3);

					if(oldNumOfKeys!=ppls[i].numOfKeys){
						rank++;
					}
					oldNumOfKeys = ppls[i].numOfKeys;
					cell0.innerHTML = rank;
					if(ppls[i].name == null){
						//cell1.innerHTML = "[null]";
					}else{
    						cell1.innerHTML = ppls[i].name;
					}

					if(ppls[i].message == null){
						//cell2.innerHTML = "[null]";
					}else{
    						cell2.innerHTML = ppls[i].message;
					}

					cell3.innerHTML = ppls[i].numOfKeys;
					console.log("index #"+i+": "+ppls[i].numOfKeys);
					if(rank == 1){
						//row.className = "table-success";
					}
					if(ppls[i].user == true){
						row.className = "table-primary";
					}
				}
				table.deleteRow(1);
			});


btnUpdateName.addEventListener('click', e => {
	console.log(userID);
	refObj.child("users").child(userID).update({
			Name:txtName.value,
			Message:txtMessage.value
		});
	$(document).ready(function(){
		$("#updatedAlert").slideDown().slideUp();
	});
});


//}());