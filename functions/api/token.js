'use strict';
// ---------------------------------------------------------------------------
// [START functionsimport]

const functions = require('firebase-functions');
const admin = require('firebase-admin');
try {admin.initializeApp();} catch(e) {} // You do that because the admin SDK can only be initialized once.
var db = admin.firestore();
var randomName = require('../randomname');

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

exports = module.exports = functions.https.onRequest(async(request, response) => {

    
    var room_name = request.query.room;
    var identity;
    
    //test bearer function

    if ((!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) &&
        !(request.cookies && request.cookies.__session)) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      response.status(403).send('Unauthorized');
      return;
    }

    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = request.headers.authorization.split('Bearer ')[1];
    } else if(request.cookies) {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = request.cookies.__session;
    } else {
      // No cookie
      response.status(403).send('Unauthorized');
      return;
    }


    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken)
      console.log('ID Token correctly decoded', decodedIdToken);
      identity = decodedIdToken.name || decodedIdToken.uid;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      response.status(403).send('Unauthorized');
      return;
    }
    
    response.send({
      room_name: room_name,
      identity: identity,
      user_info: decodedIdToken
    });
});

// [END functions]
// ---------------------------------------------------------------------------
