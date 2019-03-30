
function checkForErrors(isLoginCorrect) {
    if (!isLoginCorrect) {
        alert('login or password is incorrect');
    }
}

function showPassword(){
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function toJSON(serializedArray) {
    var data = {};
    for (var index in serializedArray) {
        data[serializedArray[index].name] = serializedArray[index].value;
    }
    return data;
}


$(document).ready(function () {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }

    $('#signup-get').click(function () {
        $('#signup-form').submit();
    });

    $('#signup-button').click(function () {
        let form = $(this).parents('form');
        let formData = form.serializeArray();
        let user = toJSON(formData);

        localStorage.setItem("currentUser", user.username);
        storeCachedData(user, function () {
            form.submit()
        });
    });
})
