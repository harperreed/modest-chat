'use strict';

// ---------------------------------------------------------------------------
// [START functionsimport]

const functions = require('firebase-functions');
const admin = require('firebase-admin');



// [END functionsimport]
// ---------------------------------------------------------------------------
// [START additionalimports]

const fs = require('fs');
const path = require('path');
const cors = require('cors')({ origin: true });



// [END additionalimports]
// ---------------------------------------------------------------------------
// [START helpers]

admin.initializeApp(functions.config().firebase);
admin.database.enableLogging(false);

var db = admin.firestore();

const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

// [END helpers] 
// ---------------------------------------------------------------------------
// [START functions] 


// [START API]

// Folder where all your individual api functions files are located.
const API_FUNCTIONS_FOLDER = './api';

fs.readdirSync(path.resolve(__dirname, API_FUNCTIONS_FOLDER)).forEach(file => { // list files in the folder.
  if(file.endsWith('.js')) {
    const fileBaseName = file.slice(0, -3); // Remove the '.js' extension
    if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === fileBaseName) {
      exports[fileBaseName] = require(`${API_FUNCTIONS_FOLDER}/${fileBaseName}`);
    }
  }
});



// [END API] 

// ---------------------------------------------------------------------------

// [END functions]
// ---------------------------------------------------------------------------
