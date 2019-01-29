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
 * @param begin_msg {String} the begin of the message (ex : an error happened)
 * @param e {Error} Error of the catch function
 * @param fallback_msg {String} (optional) if the error is unknown, we can set a default message
 */
function handleError(begin_msg, e, fallback_msg) {
  
  var ERROR_REPORT = '\nSi le problème persiste, merci de reporter l\'erreur dans "Carnet de suivi DII Polytech > Help > Report an issue".';
  var report_issue = false;
  
  var err_msg = begin_msg;
  
  if (isJson(e.message) && JSON.parse(e.message).custom == true) { // si c'est une erreur connu
    err_msg += JSON.parse(e.message).msg;
  } else {
    if (fallback_msg !== undefined) err_msg += " " + fallback_msg // default message
    report_issue = true;
  }
  
  if (report_issue !== undefined) { // si définie
    if (report_issue) { // si true
      err_msg += ERROR_REPORT;
    }
  } else { // par défaut on affiche le REPORT
    err_msg += ERROR_REPORT;
  }
  
  
//  sendUxClickGaEvent(getCaller(), JSON.stringify(e.stack)); // a changer
  console.error(JSON.stringify(e));
  sendEvent({ type : "error" }, e);
  ui.alert(err_msg);
  
}