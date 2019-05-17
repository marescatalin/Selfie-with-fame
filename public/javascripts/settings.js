function openForm() {
    if ( document.getElementById("myForm").style.display == "block"){
        document.getElementById("changePassword").innerText= "Change password";
        document.getElementById("myForm").style.display = "none"
    }else{
        document.getElementById("changePassword").innerText= "Close";
        document.getElementById("myForm").style.display = "block";
    }

}

function closeForm(username,bio,notMatch,passwordChanged) {
    if (notMatch){
        document.getElementById("username").value = username;
        document.getElementById("bio").value = bio;
        document.getElementById("changePassword").innerText= "Change password";
        document.getElementById("myForm").style.display = "block";
        alert("Current password was incorrect!");
    } if (passwordChanged){
        document.getElementById("username").value = username;
        document.getElementById("bio").value = bio;
        document.getElementById("changePassword").innerText= "Change password";
        document.getElementById("myForm").style.display = "none";
        alert("Password changed successfully!");
    }else{
        document.getElementById("username").value = username;
        document.getElementById("bio").value = bio;
        document.getElementById("myForm").style.display = "none";
    }



}

function checkPasswordMatch() {
    let newPassword = document.getElementById("new").value;
    let reNewPassword = document.getElementById("retypenew").value;
    if (newPassword != reNewPassword){
        alert("Passwords do not match!");
        document.getElementById("new").value = "";
        document.getElementById("retypenew").value = "";
        return false;
    }else{
        return true;
    }

}

$(document).ready(function () {
    $('#change').click(function () {
        if(checkPasswordMatch())
            $('#accountForm').submit();
    });

    $('#save').click(function () {
        if(checkPasswordMatch())
            $('#accountForm').submit();
    });

    $('#map-get').click(function () {
        $('#map-form').submit();
    });

});