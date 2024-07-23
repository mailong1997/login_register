const loginbt = document.getElementById("login")
const registerbt = document.getElementById("register")
document.addEventListener("DOMContentLoaded",function(){
    loginbt.addEventListener("click",login);
    registerbt.addEventListener("click",register)
});
function login(){
    window.location.href = '/login_rq';
    fetch ('/login_rq',{method:"POST",})
    .then(Response =>{window.location.href="/login_rq"})
    .catch(error =>{console.error("Error: ",error)})
}
function register(){
    fetch ('/register_rq',{method:"POST",})
    .then(Response =>{window.location.href="/register_rq"})
    .catch(error =>{console.error("Error: ",error)})
}