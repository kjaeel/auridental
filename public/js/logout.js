function logout(){
    sessionStorage.clear();
    location.replace("./index.html");
    return false;
}