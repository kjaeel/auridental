<?php

$user = "nikhil";
$pass = "toxxicsoul";

if(isset($_POST["submit"])) {
    if($_POST["username"] == $user && $_POST["password"] == $pass) {
        echo "Login successful";
		header('Location: home.html'); 
    } else {
        echo "Incorrect Login";
    }
}

?>