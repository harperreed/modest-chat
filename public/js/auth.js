/*
sign in and handle auth with firebase
*/
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("Logged in")
            window.user = user
            connectRoom("harper")

        } else {
            window.location.href = "/login.html"
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp();
    

});



function signOut() {
    firebase.auth().signOut()
}
