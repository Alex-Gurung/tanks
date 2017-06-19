const WIDTH = $(window).width();
const HEIGHT = $(window).height();
const auth = firebase.auth();
var email;
auth.onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        console.log('logged in!')
        // $('#user').val("User: " + firebaseUser.email)
        document.getElementById("user").textContent="User: " + firebaseUser.email;
        console.log(firebaseUser)
        console.log(firebaseUser.email)
        email = firebaseUser.email;
        console.log('end')
    }
    else {
        email = null;
        console.log('not logged in')
    }
})
// $(function() {
    // console.log('hey')
    // const promise = auth.signInWithEmailAndPassword('aag1234@gmail.com', 'some_password');
    // promise.catch(e => console.log(e.message))
    // console.log('hi')
// })
/* Open when someone clicks on the span element */
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

$("#password").on('keyup', function (e) {
    if (e.keyCode == 13) {
        logSign();
        // Do something
    }
});

function logSign() {
    console.log('logsign')
    var email = $('#email').val();
    var password = $('#password').val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        console.log('hi')
        var errorCode = error.code;
        var errorMessage = error.message;
        if (error) {
            console.log(error.code)
            // game.debug.text('Enemies: ' + 1 + ' / ' + 2, 32, 32);
            console.log('no user, attempting creation')
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (error) {
                    alert('error signing up\n'+ error.message)
                    console.log(error.code)
                    console.log('cant login nor create, give up')
                }
                else {
                    console.log('success!')
                    // $('#user').val("User: " + email)
                }
                // ...
            });
        }
        else {
            // console.log(email)
            // $('#user').val("User: " + email)
        }
        // console.log(error)
        // ...
    });
    closeNav();
}