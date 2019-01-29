// Event.gs


/**
 * Call sendEvent function with a json parameter including clicking information
 *
 * @param info {String} other info that may be added
 */
function sendClickEvent(info) {
  sendEvent({ collection : "Event", desc : { action : "click", label : getCaller(), extra : info } });
}


/**
 * Call sendEvent function with and error in parameter
 *
 * @param e {Error} error from the try catch
 */
function sendErrorEvent(e) {
  sendEvent({ collection : "Error", desc : e });
}


/**
 * Send information to google analytics and firestore
 *
 * @param json {String} json with information about the event
 * @param e {String} (optional) error 
 */
function sendEvent(json) {
  
  try {
    const data = {
      "user": Session.getTemporaryActiveUserKey(),
      "desc" : json.desc,
      "date" : new Date()
    }
    var firestore = getDatabase();
    firestore.createDocument(json.collection, data);
    console.info(data);
  } catch (e) {
    console.error(JSON.stringify(e));
  }
  
  if (json.collection == "Event") sendUxClickGaEvent(json);
}


/**
 * Send an user click event to google analytics
 *
 * @param label {String} label of the events
 */
function sendUxClickGaEvent(json) {
  var v = "1";
  var tid = scriptProperties.getProperty("GA_TRACKING_ID"); // tracking id
  var cid = Session.getTemporaryActiveUserKey(); // anonymous user
  var t = "event"; // event
  var ec = "UX"; // event category
  var ea = json.desc.action; // event action
  var el = lengthInUtf8Bytes(json.desc.label) <= 500 ? encodeURIComponent(json.desc.label) : encodeURIComponent("label too big");
  
  var options = {
    'method' : 'POST',
    'payload' : 'v=' + v + '&tid=' + tid + '&cid=' + cid + '&t=' + t + '&ec=' + ec + '&ea=' + ea + '&el=' + el
  };
  UrlFetchApp.fetch('https://www.google-analytics.com/collect', options);
  
  console.info("GA : " + JSON.stringify(options));
}