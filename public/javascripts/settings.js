function openForm() {
    if ( document.getElementById("myForm").style.display == "block"){
        document.getElementById("changePassword").innerText= "Change password";
        document.getElementById("myForm").style.display = "none"
    }else{
        document.getElementById("changePassword").innerText= "Close";
        document.getElementById("myForm").style.display = "block";
    }

}

function closeForm(username,bio) {
    console.log(username);
    console.log(bio);
    console.log("sjdajksdas");
    document.getElementById("username").value = username;
    document.getElementById("bio").value = bio;
    document.getElementById("myForm").style.display = "none";
}

$(document).ready(function () {
    $('#change').click(function () {
        $('#accountForm').submit();
    });

    $('#save').click(function () {
        $('#accountForm').submit();
    });

});