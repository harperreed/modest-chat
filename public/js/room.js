let localRoom



$('#logout').click(function () {
    console.log('Leaving room...');
    
    disconnect();
    signOut()
    
    return false;
});

// When we are about to transition away from this page, disconnect
// from the room, if joined.
window.addEventListener('beforeunload', leaveRoomIfJoined);




/* --------------- video handling --------------- */




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
                dominantSpeaker: true,

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
        room.on('trackDisabled', trackDisabled);
        room.on('trackUnpublished', trackUnpublished);
        room.on('participantDisconnected', participantDisconnected);
        room.on('disconnected', disconnected );
        room.on('dominantSpeakerChanged', dominantSpeaker);

        room.on('reconnected', () => {
            console.log('Reconnected!');
        });

        room.on('reconnecting', error => {
            if (error.code === 53001) {
              console.log('Reconnecting your signaling connection!', error.message);
            } else if (error.code === 53405) {
              console.log('Reconnecting your media connection!', error.message);
            }
          });

        participantMutedOrUnmutedMedia(room, mediaMuted, mediaUnmuted);

        localRoom = room
    });

}


function dominantSpeaker(participant){
    console.log('A new RemoteParticipant is now the dominant speaker:');


    $(".participant").forEach(function (parti) {
        parti.removeClass('dominant')
        parti.addClass('non-dominant')
    });

    if (dominantSpeakerChanged!=null){
        $("#"+participant.sid).addClass('dominant');
    }



    



    /* let's do somethign cool here */
}

function disconnected (room, error) {
    if (error) {
        console.log('Unexpectedly disconnected:', error);
    }
    console.log("disconnecting")
    
    room.localParticipant.tracks.forEach(function (track) {
        console.log(track)
        if (track != null){
            track.stop();
            track.detach();
            track.disconnect()
        }
    });
    room.participants.forEach(participantDisconnected)
};



function trackDisabled(track, participant) {
    console.log(`RemoteParticipant ${participant.sid} disabled Track ${track.trackSid}`);
}

function trackUnpublished(track, participant) {
    console.log(`RemoteParticipant ${participant.sid} unpublished Track ${track.trackSid}`);
}


function trackPublished(publication, participant) {
    console.log(`RemoteParticipant ${participant.sid} published Track ${publication.trackSid}`);
}



function participantConnected(participant) {
    var container = $("#remote-media")
    console.log('Participant "%s" connected', participant.identity);
    
    

    const participantDiv = $("<div>")
    participantDiv.addClass("participant"); 
    participantDiv.attr('id', participant.sid)
    participantDiv.addClass("non-dominant"); 
    

    const participantInfo = $("<div>")
    participantInfo.addClass("info"); 
    const participantName = $("<div>")
    participantName.addClass("name");
    participantName.text(participant.identity);
    participantInfo.append(participantName)

    const participantStatus = $("<div>")
    participantStatus.addClass("status"); 

    const participantAudioStatus = $("<span>")
    participantAudioStatus.addClass("audio"); 
    const participantVideoStatus = $("<span>")
    participantVideoStatus.addClass("video"); 

    
    participantStatus.append(participantAudioStatus)
    participantStatus.append(participantVideoStatus)

    const participantMedia= $("<div>")
    participantMedia.addClass("media"); 


    
    participantDiv.append(participantStatus)
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
    track.detach().forEach(element => {
        element.remove()
    });
}


// Leave Room.
function leaveRoomIfJoined() {
  if (localRoom) {
    localRoom.disconnect();
  }
}

function disconnect(roomName) {
    console.log("Safely Disconnected. lol")
    localRoom.localParticipant.tracks.forEach(function(track){ track.unpublish();}); 
    leaveRoomIfJoined()
}



/* ----- mute handlers ----- */

// Muting audio track and video tracks click handlers
$('#audioToggle').click(function () {
    toggleMuteAudio();
});

function toggleMuteAudio() {
    toggle = $('#audioToggle')
    onIcon = "fa-volume-down"
    offIcon = "fa-volume-mute"
    const mute = !$('#audioToggle').hasClass(offIcon);
    if(mute) {
        console.log("Muting local audio")
        toggle.removeClass(onIcon);
        toggle.addClass(offIcon);
        toggle.addClass("active");

        muteYourAudio(localRoom);
      

    } else {
        console.log("Unmuting local audio")
        toggle.removeClass(offIcon);
        toggle.addClass(onIcon);
        toggle.removeClass("active");
        unmuteYourAudio(localRoom);
    }
}


$('#videoToggle').click(function () {
    toggleMuteVideo();
  });

function toggleMuteVideo() {
    toggle = $('#videoToggle')
    onIcon = "fa-video"
    offIcon = "fa-video-slash"
    const mute = !toggle.hasClass(offIcon);
    if(mute) {
        console.log("Disabling local video")
        toggle.removeClass(onIcon);
        toggle.addClass(offIcon);
        toggle.addClass("active");

        muteYourVideo(localRoom);
    
    } else {
        console.log("Enabling local video")
        toggle.removeClass(offIcon);
        toggle.addClass(onIcon);
        toggle.removeClass("active");
        unmuteYourVideo(localRoom);
    }
}

function mediaMuted(track, participant){
    console.log("Participant muted track")
    videoOffIcon = "fa-video-slash"
    audioOffIcon = "fa-volume-mute"


    if (track.kind == 'audio'){
        icon = $("<i>")
        icon.attr('id', "audioMute_" + participant.sid)
        icon.addClass("fa");
        icon.addClass(audioOffIcon);
        $('#' + participant.sid + ' .status .audio').append(icon)
    }

    if (track.kind == 'video'){
        icon = $("<i>")
        icon.attr('id', "videoMute_" + participant.sid)
        icon.addClass("fa");
        icon.addClass(videoOffIcon);
        $('#' + participant.sid + ' .status .video').append(icon)
    }
}

function mediaUnmuted(track, participant){
    console.log("Participant unmuted track")
    if (track.kind == 'audio'){
        $('#audioMute_' + participant.sid).remove()
    }
    if (track.kind == 'video'){
        $('#videoMute_' + participant.sid).remove()
    }
}
 


/* ----- mute lib ----- */

/*
https://github.com/shashank76/twilio_video_call_demo/blob/e90ffe4529e04376bca0db45e73b7b3093cad1dc/examples/localmediacontrols/src/index.js
*/


/**
 * Mute/unmute your media in a Room.
 * @param {Room} room - The Room you have joined
 * @param {'audio'|'video'} kind - The type of media you want to mute/unmute
 * @param {'mute'|'unmute'} action - Whether you want to mute/unmute
 */
function muteOrUnmuteYourMedia(room, kind, action) {
    const publications = kind === 'audio'
      ? room.localParticipant.audioTracks
      : room.localParticipant.videoTracks;
  
    publications.forEach(function(publication) {
      if (action === 'mute') {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
    });
  }
  
  /**
   * Mute your audio in a Room.
   * @param {Room} room - The Room you have joined
   * @returns {void}
   */
  function muteYourAudio(room) {
    muteOrUnmuteYourMedia(room, 'audio', 'mute');
  }
  
  /**
   * Mute your video in a Room.
   * @param {Room} room - The Room you have joined
   * @returns {void}
   */
  function muteYourVideo(room) {
    muteOrUnmuteYourMedia(room, 'video', 'mute');
  }
  
  /**
   * Unmute your audio in a Room.
   * @param {Room} room - The Room you have joined
   * @returns {void}
   */
  function unmuteYourAudio(room) {
    muteOrUnmuteYourMedia(room, 'audio', 'unmute');
  }
  
  /**
   * Unmute your video in a Room.
   * @param {Room} room - The Room you have joined
   * @returns {void}
   */
  function unmuteYourVideo(room) {
    muteOrUnmuteYourMedia(room, 'video', 'unmute');
  }
  
  /**
   * A RemoteParticipant muted or unmuted its media.
   * @param {Room} room - The Room you have joined
   * @param {function} onMutedMedia - Called when a RemoteParticipant muted its media
   * @param {function} onUnmutedMedia - Called when a RemoteParticipant unmuted its media
   * @returns {void}
   */
  function participantMutedOrUnmutedMedia(room, onMutedMedia, onUnmutedMedia) {
    room.on('trackSubscribed', function(track, publication, participant) {
      track.on('disabled', function() {
        return onMutedMedia(track, participant);
      });
      track.on('enabled', function() {
        return onUnmutedMedia(track, participant);
      });
    });
  }