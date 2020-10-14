// https://github.com/grahamearley/FirestoreGoogleAppsScript
// https://console.firebase.google.com/project/cds-polytech/firestore/data
// https://console.cloud.google.com/bigquery?folder=&organizationId=&project=cds-polytech


/**
 * Create a database instance
 *
 * @return {Firestore} Object initialized
 */
function getDatabase() {
    
  const [email, key, projectId] = [firestore_credentials.client_email, firestore_credentials.private_key, firestore_credentials.project_id];
  const firestore = FirestoreApp.getFirestore(email, key, projectId);
  
  return firestore;
  
}