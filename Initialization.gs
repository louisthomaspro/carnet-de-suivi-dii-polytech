// Initialization.gs


/**
* Main initialize function : ask for initialization and call other initializing functions
*/
function initialize() {
  
  var ui = SpreadsheetApp.getUi();
  
  var response = ui.alert("Voulez-vous initialiser le carnet suivi maintenant ?\n" +
                          "Un Google Docs nommé '_template' sera créé.",
                          ui.ButtonSet.YES_NO);
  
  if (response == ui.Button.YES) {
        
    try {
      sendClickEvent("initialize()");
      
      downloadGdocsTemplate();
      ui.alert("Carnet de suivi initialisé ! Vous pouvez maintenant tester la génération du carnet de suivi dans :\n" +
               "\"Carnet de suivi DII Polytech > Générer\"");
      
    } catch (e) {
      handleError(e, true, "Impossible d\'initialiser le carnet de suivi.");
    }
    
  }
}


/**
* Initialize/replace the Google Doc template. Delete all files named '_template' and download official files '_template'
*/
function downloadGdocsTemplate() {
  
  var template = DriveApp.getFileById(DOC_SOURCE); // get official template file
  var parentFolder = getFolderOfFileId(SpreadsheetApp.getActiveSpreadsheet().getId()); // get parent folder of the spreadsheet
  
  // Make copy of the template and rename it
  var template_copy = template.makeCopy(parentFolder).setName('_template');
  
}