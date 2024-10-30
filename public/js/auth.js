/*
sign in and handle auth with firebase
*/
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("Logged in")
            window.user = user;
            const roomName = window.location.pathname.split('/').pop() || 'default';
            connectRoom(roomName);
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
