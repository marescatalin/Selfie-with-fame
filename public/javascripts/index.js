
function checkForErrors(isLoginCorrect) {
    initDatabase();
    if (!isLoginCorrect) {
        alert('login or password is incorrect');
    }
    storeCachedData({username: 'marescatalinn111' , password : 'barosan' , bio: 'ceva'});

}

function showPassword(){
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function signUp(){
    storeCachedData({username: 'marescatalinn' , password : 'barosan' , bio: 'ceva'});
}