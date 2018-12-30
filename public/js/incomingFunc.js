// call incoming API
var dropStatus = null;
var officeId = null;
  var userInfo =  JSON.parse(sessionStorage.getItem("user"));
  var baseUrl =  sessionStorage.getItem("baseUrl");

  var  user_id = userInfo.id;     
  console.log("user_id inside incoming func :",user_id);
    
	function statusDropDown(){
      dropStatus = document.getElementById("status").value;
	  		console.log("status :",dropStatus);
	}
    function officeDropDown(){
       officeId = document.getElementById("getoffice").value;
       
        console.log(officeId);

  }
	

	 document.getElementById('postData').addEventListener('submit', postData);

 function postData(event){
            event.preventDefault();
            	let tittle = document.getElementById('tittle').value;
                let name = document.getElementById('pat').value;             
                let stat = document.getElementById('status').value;
                


          console.log(tittle)
          console.log(name)
   
          console.log("status------------------->	",stat)
          console.log("o id-------------------> ",officeId)

            	var reqObj ={
					"caseNumber" : tittle,
					"pat": name,
					"user_id" : officeId,
					"status"  : stat,
					
				}
            fetch(baseUrl+'incoming/addIncoming', {
                method: 'POST',
                //headers : new Headers(),
               	headers : {
		            "Content-Type": "application/json; charset=utf-8"
		             // "Authorization": "5asvhff4jgjkjrbd1hjj5hkjhkkghk87gdsgbshb5hsh/gg4sa5gaga4fafafa4g5jngh5j4fgjfhj54fgj54fg5j",
		        },
		         body:JSON.stringify(reqObj)
            }).then((res) => res.json())
            .then((data) => {
            	console.log(data)
			  if(data.code == 999){
                alert(data.errorMessage)  
              }else{
                alert(data.displayMessage);
              }             	 
            })
            .catch((err)=>{console.log(err.errorMessage);
            	alert(err.errorMessage)
            })
        }


 function getOffice(){
            //event.preventDefault();
   
    let url = baseUrl+'office/getUser';
    fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (userData) {
      console.log("data--->",userData);
        if(userData.code == 0){
                console.log(userData)
               var contracts = document.getElementById("getoffice");
                contracts.options.length =  0;
                
                var initialOption = document.createElement("option");
                initialOption.innerHTML = "select office";
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
getOffice();