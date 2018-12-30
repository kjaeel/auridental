
// CALL LOGIN API

 //var baseUrl  = "http://localhost:6001/api/v1/" 
 var baseUrl  = "http://35.237.40.210/api/v1/" 

 document.getElementById('login').addEventListener('submit', postData);

 function postData(event){
            event.preventDefault();
            	let username = document.getElementById('username').value;
                let password = document.getElementById('password').value;
              
          console.log(username)
          console.log(password)
        
            	var reqObj ={
            		"userName" : username,
					"password": password
            	}
            	console.log(reqObj)
            fetch(baseUrl+'office/login', {
                method: 'POST',
                //headers : new Headers(),
               	headers : {
		            "Content-Type": "application/json; charset=utf-8"
		             // "Authorization": "5asvhff4jgjkjrbd1hjj5hkjhkkghk87gdsgbshb5hsh/gg4sa5gaga4fafafa4g5jngh5j4fgjfhj54fgj54fg5j",
		        },
		         body:JSON.stringify(reqObj)
            }).then((res) => res.json())
            .then((result) => {
            	console.log(result)
				if(result.code == 0){
                      // Check browser support
                if (typeof(Storage) !== "undefined") {
                    // Store
                    if(result.hasOwnProperty("data") && result.data.hasOwnProperty("user")){
                        sessionStorage.setItem("user", JSON.stringify(result.data.user));
                        sessionStorage.setItem("baseUrl", baseUrl);
                    }else{
                        console.log("session variablenot set!!!!!");
                    }
                    
                    // Retrieve
                    console.log("sessionStorage--------------------------->", JSON.parse(sessionStorage.getItem("user")))
                } else {
                    console.log("Sorry, your browser does not support Web Storage...");
                }
			     location.replace("./home.html");
    			} else{
    				document.getElementById('errorop').innerHTML="Invalid Credentials!";
    			}      	 
            })

            .catch((err)=>{console.log(err);
            	alert(JSON.stringify(err))
            })
        }

