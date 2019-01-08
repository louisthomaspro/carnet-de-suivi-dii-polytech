 
function getDatabase() {
  
  // https://github.com/grahamearley/FirestoreGoogleAppsScript
  // https://console.cloud.google.com/firestore/data?project=project-id-8118344773538487150
  
  var firebase_auth = JSON.parse(scriptProperties.getProperty('FIREBASE_AUTH'));
  const firestore = FirestoreApp.getFirestore(firebase_auth.client_email, firebase_auth.private_key, firebase_auth.project_id);
  return firestore;
  
}