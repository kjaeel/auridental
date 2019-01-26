// call incoming API
var dropStatus = null;
  var userInfo =  JSON.parse(sessionStorage.getItem("user"));
  var baseUrl =  sessionStorage.getItem("baseUrl");
  var  user_id = userInfo.id;
  var userType = userInfo.userType;
  //var baseUrl = "/api/v1/incoming/getDelivered?user_id="//5c0aa20a6ebbb603a0ec068a
  var officeId = false;
  var adminFlag = false;   
if(userType.toLowerCase() == "admin"){
    adminFlag = true;
}

 function getOffice(){
            //event.preventDefault();
   
    let url = baseUrl+'office/getUser';
    fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (userData) {
 ///     console.log("data-  office-->",userData);
        if(userData.code == 0){
                console.log(userData)
               var contracts = document.getElementById("getDB");
                contracts.options.length =  0;
                
                var initialOption = document.createElement("option");
                initialOption.innerHTML = "Select Office";
                contracts.options.add(initialOption);
                //Add the Options to the DropDownList.
                userData.data.forEach(office => {
                  var option = document.createElement("OPTION");
      
                  //Set Customer Name in Text part.
                  option.setAttribute("value", office.id);
                  option.innerHTML = office.userName;

                  //Set CustomerId in Value part.
                  //option.value = contracts.id;
                  //Add the Option element to DropDownList.
                  contracts.options.add(option);
                });
              }else{
                //alert(data.displayMessage);
              }                
            })
            .catch((err)=>{console.log(err);
              //alert(err.errorMessage)
            })
}

 function officeDropDown(){
   officeId = document.getElementById("getDB").value;
   
    console.log(officeId);
    adminFlag  = true;
    getAPI();

}
var url;
function getAPI(){
  if(!adminFlag){
    url = baseUrl +"incoming/getDelivered?user_id="+ user_id ;
  } 
  else {
     url = baseUrl +"incoming/getDelivered?user_id="+ officeId;
    }
            // code to execte
     fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
    //	console.log("data--->",data);
    	  if(data.code == 0){
		    	var incoming = data.data;
		    	if(incoming && incoming.length){
					var tableProcessing = document.getElementById("finish");
          while (tableProcessing.rows.length > 1) {
            tableProcessing.deleteRow(1);
          }
		    		for (var i = 0; i < incoming.length; i++) {
		    				var row = tableProcessing.insertRow(-1);
						    var caseno = row.insertCell(0);
						    var name = row.insertCell(1);					    
                 var status = row.insertCell(2);
                 var date = row.insertCell(3);
                caseno.innerHTML = incoming[i].caseNumber;
						    name.innerHTML = incoming[i].pat;						   
                status.innerHTML = incoming[i].status;
                var finalSemiDate = new Date(incoming[i].createdAt);
                var finalDate = finalSemiDate.getDate()+"-"+(finalSemiDate.getMonth()+1)+"-"+finalSemiDate.getFullYear();
                date.innerHTML = finalDate;
               // date.innerHTML = incoming[i].createdAt;
					    
		    		}
		    	
	    }else{
	    	console.log("no  data");
        var tableProcessing = document.getElementById("finish");
        while (tableProcessing.rows.length > 1) {
          tableProcessing.deleteRow(1);
        }
	    }
    }else{
      console.log("no  data");
        var tableProcessing = document.getElementById("finish");
        while (tableProcessing.rows.length > 1) {
          tableProcessing.deleteRow(1);
        }
    }
	});
}

if(userType == "admin"){
  getOffice();
}else{
  getAPI();
}