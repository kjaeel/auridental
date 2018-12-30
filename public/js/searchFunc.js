//var baseUrl = "http://a2e577db.ngrok.io/api/v1/incoming/getIncoming?"//5c0aa20a6ebbb603a0ec068a
// call incoming API
var dropStatus = null;
var userInfo =  JSON.parse(sessionStorage.getItem("user"));
var baseUrl =  sessionStorage.getItem("baseUrl");
var  user_id = userInfo.id;  
var userType = userInfo.userType; 
 var adminFlag = false;   
if(userType.toLowerCase() == "admin"){
    adminFlag = true;
}   
console.log("user_id inside history func :",user_id);
//event.preventDefault();
var searchFilter = null;         
function serchFilter(filter){
	console.log("filter---------->",filter);
	searchFilter = filter;
return false;
}
  
function searchAPI(){
            // code to execte
     var text = document.getElementById("global-search").value;
     console.log("text------------->",text);
     if (!adminFlag) {
     	 var url = baseUrl +"incoming/getIncoming?user_id="+ user_id ;
     }
     else{
     	var url = baseUrl + "incoming/getIncoming?";
     }
	
	 if(searchFilter == "caseno") url = url + "&caseNumber=";	 
	 if(searchFilter == "pat") url = url + "&pat=";
     if(searchFilter) url = url + text;
     console.log("Final url----->",url);
     fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
    	console.log("data--->",data);
    	  if(data.code == 0){
		    	var incoming = data.data;
		    	if(incoming && incoming.length){
					var tableProcessing = document.getElementById("processing");
					var tableComplete = document.getElementById("complete");
					//tableProcessing.innerHTML = "";
		            $("#processing").find("tr:not(:first)").remove();
		            $("#complete").find("tr:not(:first)").remove();
					var tableDelivered = document.getElementById("delivered");
					console.log("---------------------->",tableDelivered)
		            $("#delivered").find("tr:not(:first)").remove();

					//tableComplete.innerHTML = "";
		    		for (var i = 0; i < incoming.length; i++) {
		    			if(incoming[i].status ===  "In process"){
		    				var row = tableProcessing.insertRow(-1);
						    var caseno = row.insertCell(0);						    
						    var patient = row.insertCell(1);
   						    var status = row.insertCell(2);
							caseno.innerHTML = incoming[i].caseNumber;													  
						   	patient.innerHTML = incoming[i].pat;
						   	status.innerHTML = incoming[i].status;
		    			}else if(incoming[i].status === "Process Finished"){
		    				var row = tableComplete.insertRow(-1);
						    var caseno = row.insertCell(0);
						    var naam = row.insertCell(1);						   
   						  	var status = row.insertCell(2);
               				naam.innerHTML = incoming[i].pat;               
						    status.innerHTML = incoming[i].status;
 						   	caseno.innerHTML = incoming[i].caseNumber;
			              

					    }
		    			else if(incoming[i].status ===  "Delivered"){

		    				var row = tableDelivered.insertRow(-1);
						    var caseno = row.insertCell(0);						   
						    var patient = row.insertCell(1);
   						    var status = row.insertCell(2);

						    caseno.innerHTML = incoming[i].caseNumber;						    
						    status.innerHTML = incoming[i].status;
 						   	patient.innerHTML = incoming[i].pat;

		    			}
					    
		    		}
		   	 }else{
		   	 	 $("#processing").find("tr:not(:first)").remove();
		         $("#complete").find("tr:not(:first)").remove();
		   	 }
		    	
	    }else{
	    	console.log("no  data");
	    }
    
	})
}