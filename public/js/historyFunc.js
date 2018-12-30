//var baseUrl = "http://a2e577db.ngrok.io/api/v1/incoming/getIncoming?user_id="//5c0aa20a6ebbb603a0ec068a
// call incoming API
var dropStatus = null;
  var userInfo =  JSON.parse(sessionStorage.getItem("user"));
  var baseUrl =  sessionStorage.getItem("baseUrl");
  var  user_id = userInfo.id;
  var userType = userInfo.userType;
  var officeId = false;
  var adminFlag = false;  

  console.log("user_id inside history func :",user_id);
   //event.preventDefault();      
// GET USER API
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
    url = baseUrl +"incoming/getIncoming?user_id="+ user_id ;
  } 
  else {
     url = baseUrl +"incoming/getIncoming?user_id="+ officeId;
    }
            // code to execte
     fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
    	//console.log("data--->",data);
    	  if(data.code == 0){
		    	var incoming = data.data;
		    	if(incoming && incoming.length){
					var tableProcessing = document.getElementById("processing");
          while (tableProcessing.rows.length > 1) {
            tableProcessing.deleteRow(1);
          }

          var tableComplete = document.getElementById("complete");
          while (tableComplete.rows.length > 1) {
            tableComplete.deleteRow(1);
          }

		    		for (var i = 0; i < incoming.length; i++) {
		          console.log("status ----",incoming[i].status);
        			if(incoming[i].status ===  "In process"){
		    				var row = tableProcessing.insertRow(-1);
						    var caseno = row.insertCell(0);
						    var naam = row.insertCell(1);					    
   						  var status = row.insertCell(2);
                if(userType =='admin'){
                  var dynamicButton = row.insertCell(3);
                  var button = document.createElement('button');
                  button.className = "w3-button w3-blue";
                  button.setAttribute("id", "changeStatus"+i);
                  button.innerHTML = 'Update Status';
                  dynamicButton.appendChild(button);
                  caseno.innerHTML = "<p class = 'cn' id = "+incoming[i].id+">" +incoming[i].caseNumber+"</p>";
                  var statusBtn = document.getElementById("changeStatus"+i);
                  statusBtn.addEventListener("click", function(){
                    callUpdateStatus.call(self);
                  }, false);
                  //rowIndex
                }else{
                   caseno.innerHTML = incoming[i].caseNumber;
                }
                // if(incoming[i].hasOwnProperty("pat"))
                  naam.innerHTML = incoming[i].pat;               
						    status.innerHTML = incoming[i].status;
				
		    			}else if(incoming[i].status === "Process Finished"){
		    				var row = tableComplete.insertRow(-1);
						    var caseno = row.insertCell(0);
						    var naam = row.insertCell(1);						   
   						  var status = row.insertCell(2);
                naam.innerHTML = incoming[i].pat;               
						    status.innerHTML = incoming[i].status;
 						   	
                 if(userType =='admin'){
                  var dynamicButton = row.insertCell(3);
                  var button = document.createElement('button');
                  button.className = "w3-button w3-blue";
                  button.setAttribute("id", "changeStatus"+i);
                  button.innerHTML = 'Update Status';
                  dynamicButton.appendChild(button);
                  caseno.innerHTML = "<p class = 'cn' id = "+incoming[i].id+">" +incoming[i].caseNumber+"</p>";
                  var statusBtn = document.getElementById("changeStatus"+i);
                  statusBtn.addEventListener("click", function(){
                    callUpdateStatusRevert.call(self);
                  }, false);
                }else{
                   caseno.innerHTML = incoming[i].caseNumber;
                }

		    			}
					    
		    		}
		   	 }else{
          console.log("no  data");
          var tableProcessing = document.getElementById("processing");
          var tableComplete = document.getElementById("complete");
          while (tableProcessing.rows.length > 1) {
            tableProcessing.deleteRow(1);
          }
          while (tableComplete.rows.length > 1) {
            tableComplete.deleteRow(1);
          }
      }
	    }else{
	    	console.log("no  data");
        var tableProcessing = document.getElementById("processing");
        var tableComplete = document.getElementById("complete");
        while (tableProcessing.rows.length > 1) {
          tableProcessing.deleteRow(1);
        }
        while (tableComplete.rows.length > 1) {
          tableComplete.deleteRow(1);
        }
	    }
    
	})
}
 

function callUpdateStatus(x){
   event.preventDefault();
  $("#processing").on('click', 'tr', function(){

   var rowIndex = ($(this).index()-1);
          //alert('Clicked row '+ ($(this).index()-1));
   //console.log("rowIndex=-===:",rowIndex);  

   event = event || window.event; //for IE8 backward compatibility
        var target = event.target || event.srcElement; //for IE8 backward compatibility
          console.log("table value---->", $(this).text());

        while (target && target.nodeName != 'TR') {
            target = target.parentElement;
        }
        var cells = $(this).html()//target.cells; //cells collection
        //var cells = target.getElementsByTagName('td'); //alternative
        /*if (!cells.length || target.parentNode.nodeName == 'THEAD') { // if clicked row is within thead
            return;
        }*/
                  console.log("table data---->",cells);

          console.log("table data---->",cells.split("=")[2].split('>')[0]);
          let incoming_id = cells.split("=")[2].split('>')[0]
          incoming_id= incoming_id.substring(1, incoming_id.length - 1);
          console.log("after removal ->",incoming_id);
            	var reqObj ={
                  					"status": "Process Finished",
                   					"id" : incoming_id
                          }
  //          	console.log(reqObj)
            fetch(baseUrl+'incoming/updateIncoming', {
                method: 'POST',
                //headers : new Headers(),
               	headers : {
		            "Content-Type": "application/json; charset=utf-8"
		             // "Authorization": "5asvhff4jgjkjrbd1hjj5hkjhkkghk87gdsgbshb5hsh/gg4sa5gaga4fafafa4g5jngh5j4fgjfhj54fgj54fg5j",
		        },
		         body:JSON.stringify(reqObj)
            }).then((res) => res.json())
            .then((result) => {
            	console.log("result ----->",result)
				if(result.code == 0){
                      // Check browser support
                      //location.reload();
                      getAPI();
                
    			} else{
    				alert("error occured");
    			}      	 
            })

            .catch((err)=>{console.log(err);
            	alert(JSON.stringify(err))
            })
 });
}

function callUpdateStatusRevert(x){
   event.preventDefault();
  $("#complete").on('click', 'tr', function(){
         // console.log("table value---->", $(this).html());

   var rowIndex = ($(this).index()-1);
          //alert('Clicked row '+ ($(this).index()-1));
   console.log("rowIndex=-===:",rowIndex);  
   event = event || window.event; //for IE8 backward compatibility
        var target = event.target || event.srcElement; //for IE8 backward compatibility
//          console.log("table target---->",target);

        while (target && target.nodeName != 'TR') {
            target = target.parentElement;
        }
        var cells = $(this).html()//target.cells; //cells collection
                  console.log("table celssa---->",cells);

        //var cells = target.getElementsByTagName('td'); //alternative
       /* if (!cells.length || target.parentNode.nodeName == 'THEAD') { // if clicked row is within thead
            return;
        }*/
        
          console.log("table data---->",cells.split("=")[2].split('>')[0]);
          let incoming_id = cells.split("=")[2].split('>')[0]
          incoming_id= incoming_id.substring(1, incoming_id.length - 1);
          console.log("after removal ->",incoming_id);
              var reqObj ={
          "status": "In process",
          "id" : incoming_id
              }
              console.log(reqObj)
            fetch(baseUrl+'incoming/updateIncoming', {
                method: 'POST',
                //headers : new Headers(),
                headers : {
                "Content-Type": "application/json; charset=utf-8"
                 // "Authorization": "5asvhff4jgjkjrbd1hjj5hkjhkkghk87gdsgbshb5hsh/gg4sa5gaga4fafafa4g5jngh5j4fgjfhj54fgj54fg5j",
            },
             body:JSON.stringify(reqObj)
            }).then((res) => res.json())
            .then((result) => {
              console.log("result ----->",result)
        if(result.code == 0){
                      // Check browser support
                      //location.reload();
                    //  if(result && result.length){
                         getAPI();
                      //}
                
          } else{
            alert("error occured");
          }        
            })

            .catch((err)=>{console.log(err);
              alert(JSON.stringify(err))
            })
  });

}

if(userType == "admin"){
  getOffice();
}else{
  console.log("calling normal office not admiin!!"); 
  getAPI();
}
