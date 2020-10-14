// Event.gs


/**
 * Send anonymous information to database for analytics
 *
 * @param action {String} ex: click, notification, open...
 * @param data {String} useful data
 * @param e {Error} error if exist
 */
function sendEvent(action, data, e) {
  
  // Get datetime
  var timezone = "GMT+" + new Date().getTimezoneOffset()/60
  var datetime = Utilities.formatDate(new Date(), timezone, "dd-MM-yyyy'T'HH:mm:ss'Z'");
  
  var error = (e == undefined) ? false : { "stack": e.stack }; // if error exist, get error info
  
  var document = {
    "datetime": datetime,
    "user": {
      "sha512_email": sha512(Session.getActiveUser().getEmail()), // hash user email => RGPD friendly :)
      "userKey": Session.getTemporaryActiveUserKey() // unique key every 30 days
    },
    "action": action,
    "data": data,
    "version": CONSTANTS.version,
    "error": error
  }
  var firestore = getDatabase();
  firestore.createDocument("events", document);

}