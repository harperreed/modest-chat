'use strict';
// ---------------------------------------------------------------------------
// [START functionsimport]

const functions = require('firebase-functions');
const admin = require('firebase-admin');
try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.
var db = admin.firestore();
var randomName = require('../randomname');
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

// [END functionsimport]
// ---------------------------------------------------------------------------
// [START additionalimports]



// [END additionalimports]
// ---------------------------------------------------------------------------
// [START helpers]

// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 14400;

// [END helpers] 
// ---------------------------------------------------------------------------
// [START functions] 

/* 
 * 
 *
 */ 

exports = module.exports = functions.https.onRequest((request, response) => {

    var identity = request.query.identity || randomName();
    var room_name = request.query.room_name;

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created.
    var token = new AccessToken(
        functions.config().twilio.account_sid,
        functions.config().twilio.api_key,
        functions.config().twilio.api_secret,
      { ttl: MAX_ALLOWED_SESSION_DURATION }
    );
  
    // Assign the generated identity to the token.
    token.identity = identity;
  
    // Grant the access token Twilio Video capabilities.
    var grant = new VideoGrant();
    token.addGrant(grant);
  
    // Serialize the token to a JWT string and include it in a JSON response.
    response.send({
      room_name: room_name,
      identity: identity,
      token: token.toJwt()
    });
});

// [END functions]
// ---------------------------------------------------------------------------
