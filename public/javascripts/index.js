var rememberMe = false;
var usernameSession = "";

function checkLogin(login_is_correct,username){
    if (!login_is_correct) {
        document.getElementById("username").value = username;
        alert("log in is incorrect");
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
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch (function (error){
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
    $('#check').click(function() {
        $(this).is(':checked') ? $('input[name=password]').attr('type', 'text') : $('input[name=password]').attr('type', 'password');
        $(this).is(':checked') ? rememberMe = true : rememberMe = false;
        console.log(rememberMe);
    });

    // rememberMe
    $('#rememberMe').click(function() {
        $(this).is(':checked') ? rememberMe = true : rememberMe = false;
        console.log(rememberMe);
    });

    $('#signup-get').click(function () {
        $('#signup-form').submit();
    });

    $('#login').click(function () {
        console.log(rememberMe);
        if (rememberMe)
            document.cookie = "permanentSession="+String(document.getElementById("username").value);
        $('#signin-form').submit();
    });

    // $('#login').click(async function () {
    //     let form = $(this).parents('form');
    //     let formData = form.serializeArray();
    //     let user = toJSON(formData);
    //     if (await getLoginData(user)) {
    //         localStorage.setItem("currentUser", user.username);
    //         $('#signin-form').submit();
    //     } else {
    //         alert('username or password is incorrect');
    //         $('input[name=password]').val('');
    //     }
    // });

    $('#signup-button').click(function () {
        let form = $(this).parents('form');
        let formData = form.serializeArray();
        let user = toJSON(formData);
        //
        localStorage.setItem("currentUser", user.username);
        form.submit()
        // storeCachedData(user, function () {
        //     form.submit()
        // });
    });
});
