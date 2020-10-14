// Initialization.gs


/**
* Main initialize function : ask for initialization and call other initializing functions
*/
function initialize() {
  
  handleNotifications(); // Show user notifications
  
  var ui = SpreadsheetApp.getUi();
  
  var response = ui.alert("Voulez-vous initialiser le carnet suivi maintenant ?\n" +
                          "Un Google Docs nommé '_template' sera créé.",
                          ui.ButtonSet.YES_NO);
  
  if (response == ui.Button.YES) {
    
    try {
      downloadGdocsTemplate();
    } catch (e) {
      sendEvent("click", { "function": "initialize()" }, e);
      return handleError(e, "Impossible d\'initialiser le carnet de suivi.");
    }
    sendEvent("click", { "function": "initialize()" });
    ui.alert("Carnet de suivi initialisé ! Vous pouvez maintenant tester la génération du carnet de suivi dans :\n" +
               "\"Carnet de suivi DII Polytech > Générer\"");
  }
  
  createEditTriggers();
  createOpenTriggers();
}


/**
* Initialize/replace the Google Doc template. Delete all files named '_template' and download official files '_template'
*/
function downloadGdocsTemplate() {
  var template = DriveApp.getFileById(CONSTANTS.files.template); // get official template file
  var parentFolder = getFolderOfFileId(SpreadsheetApp.getActiveSpreadsheet().getId()); // get parent folder of the spreadsheet
  var template_copy = template.makeCopy(parentFolder).setName('_template'); // Make copy of the template and rename it
}


/**
* Create a trigger that call "editTrigger()" on edit
*/
function createEditTriggers() {
  var triggerExist = false;
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (
      triggers[i].getEventType() == ScriptApp.EventType.ON_EDIT &&
      triggers[i].getTriggerSource() == ScriptApp.TriggerSource.SPREADSHEETS && 
      triggers[i].getHandlerFunction() == "editTrigger"
    ) {
      triggerExist = true;
      break;
    }
  }
  if (!triggerExist) {
    var ss = SpreadsheetApp.getActive();
    ScriptApp.newTrigger('editTrigger')
      .forSpreadsheet(ss)
      .onEdit()
      .create();
  }
}


/**
* Create a trigger that call "openTrigger()" on open
*/
function createOpenTriggers() {
  var triggerExist = false;
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (
      triggers[i].getEventType() == ScriptApp.EventType.ON_OPEN &&
      triggers[i].getTriggerSource() == ScriptApp.TriggerSource.SPREADSHEETS && 
      triggers[i].getHandlerFunction() == "openTrigger"
    ) {
      triggerExist = true;
      break;
    }
  }
  if (!triggerExist) {
    var ss = SpreadsheetApp.getActive();
    ScriptApp.newTrigger('openTrigger')
      .forSpreadsheet(ss)
      .onOpen()
      .create();
  }
}