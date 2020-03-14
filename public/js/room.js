
$('#logout').click(function () {
    console.log('Leaving room...');
    disconnect();
    signOut()
    
    return false;
});

function connectRoom(roomName){
    firebase.auth().currentUser.getIdToken().then(function (token) {
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            "error": function () { 
                alert("Error #7: Invalid token. Signing out"); 
                signOut();
            }
            
        });
    
        // Obtain a token from the server in order to connect to the Room.
        $.getJSON("/token", { room: roomName }, function (data) {
            identity = data.identity;
            var connectOptions = {
                audio: true,
                video: { width: 640 , height: 480},
                name: roomName,
                //logLevel: 'debug'
            };
            
            videoConnect(data.token, connectOptions)
        });
    })
}


function videoConnect(token, options){
    
    var remoteMediaContainer = $("#remote-media")
    var localMediaContainer = $("#local-media")
    console.log(remoteMediaContainer)


    Video.connect(token, options).then(room => {
        console.log('Connected to Room "%s"', room.name);

        
        room.localParticipant.tracks.forEach(publication => {
                trackSubscribed(localMediaContainer, publication.track);
        });
        
        room.participants.forEach(participantConnected);
        room.on('participantConnected', function (participant) {
            console.log("Joining: '" + participant.identity + "'");
            participantConnected(participant);
        });
        

        // Handle RemoteTracks published after connecting to the Room.
        room.on('trackPublished', trackPublished);
        room.on('participantDisconnected', participantDisconnected);
        room.on('disconnected', disconnected );
        room.on('dominantSpeakerChanged', dominantSpeaker);
    });

}


function dominantSpeaker(participant){
    console.log('A new RemoteParticipant is now the dominant speaker:', participant);
    console.log(participant.sid)
    $("#"+participant.sid).remove();
    /* let's do somethign cool here */
}

function disconnected (room, error) {
    if (error) {
        console.log('Unexpectedly disconnected:', error);
    }
    console.log("disconnecting")
    
    room.localParticipant.tracks.forEach(function (track) {
        track.stop();
        track.detach();
    });
    room.participants.forEach(participantDisconnected)
};


function trackPublished(publication, participant) {
    console.log(`RemoteParticipant ${participant.sid} published Track ${publication.trackSid}`);
}



function participantConnected(participant) {
    var container = $("#remote-media")
    console.log('Participant "%s" connected', participant.identity);
    
    

    const participantDiv = $("<div>")
    participantDiv.addClass("participant"); 
    participantDiv.attr('id', participant.sid)
    
    const participantInfo = $("<div>")
    participantInfo.addClass("info"); 
    participantInfo.text(participant.identity);

    const participantMedia= $("<div>")
    participantMedia.addClass("media"); 

    participantDiv.append(participantInfo)
    participantDiv.append(participantMedia)
    
    container.append(participantDiv);

    participant.on('trackSubscribed', track => trackSubscribed(participantMedia, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
            trackSubscribed(participantMedia, publication.track);
        }else{
            //participantDisconnected(participant)
        }
    });


   
}

function participantDisconnected(participant) {
    console.log('Participant "%s" disconnected', participant.identity);
    console.log(participant.sid)
    $("#"+participant.sid).remove();
}

function trackSubscribed(div, track) {

    /* track info */
    /*
    if (track.kind === 'video') {
        track.once('started', () => console.log(track));
    }
    */

    div.append(track.attach());
}

function trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
}

function disconnect(roomName) {
    console.log("Safely Disconnected. lol")
}