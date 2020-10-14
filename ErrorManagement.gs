// ErrorManagement.gs


/**
 * Handle an error by displaying the good message
 *
 * @param e {Error} Error of the catch function
 * @param error_msg {String} error message
 * @param display {boolean} display error in an alertbox
 */
function handleError(e, err_msg) {
  err_msg += "\n\nStack: " + e.stack;
  err_msg += '\n\nSi le problème persiste, merci de reporter l\'erreur dans "Carnet de suivi DII Polytech > Aide".';
  SpreadsheetApp.getUi().alert(err_msg);
}