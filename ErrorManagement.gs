// ErrorManagement.gs


/**
 * Create and return a custom stringify json for an error message
 *
 * @param msg {String} Message of the error
 */
function customError(msg) {
  var err = {
    custom : true,
    msg : msg
  };
  return JSON.stringify(err);
}


/**
 * Handle an error by displaying the good message
 *
 * @param e {Error} Error of the catch function
 * @param display {boolean} display error in an alertbox
 * @param begin_msg {String} the begin of the message (ex : an error happened)
 * @param fallback_msg {String} (optional) if the error is unknown, we can set a default message
 */
function handleError(e, display /*false*/, what_happened, trivial_solution) {
 
  try {
    var knownError = false;
    var report_issue = false; // we suggest to report an issue only if the error is unknown
    
    var err_msg = what_happened;
    
    if (display == undefined) {
      display = false;
    }
    
    if (isJson(e.message) && JSON.parse(e.message).custom == true) { // if we known the error
      var customErrorMsg = JSON.parse(e.message).msg;
      err_msg += " " + customErrorMsg;
      e.message = customErrorMsg; // set the real error message for the event after
      knownError = true;
    }
    
    err_msg += " " + trivial_solution;
    err_msg += '\n\nSi le problème persiste, merci de reporter l\'erreur dans "Carnet de suivi DII Polytech > Help > Report an issue".';
    
    if (knownError) {
      console.info(JSON.stringify(e));
    } else {
      console.warn(JSON.stringify(e));
    }
    
    if (display) SpreadsheetApp.getUi().alert(err_msg);
    
  } catch (e) {
    
    console.error("Error in handleError() : " + JSON.stringify(e)); // A tester
    
  }
  
}