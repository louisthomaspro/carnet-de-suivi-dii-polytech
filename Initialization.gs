// Initialization.gs


/**
* Main initialize function : ask for initialization and call other initializing functions
*/
function initialize() {
  
  var response = ui.alert("Voulez-vous initialiser tout votre carnet suivi maintenant ?\n" +
                          "Un dossier nommé 'Carnet de suivi DII' sera généré. Dedans :\n" +
                          "- Ce Google Sheets sera initialisé\n" +
                          "- Un Google Docs nommé '_template' sera créé",
                          ui.ButtonSet.YES_NO);
  
  if (response == ui.Button.YES) {
        
    try {
      sendClickEvent();
      
      setInFolder();
      initGsheets();
      downloadGdocsTemplate();
      ui.alert("Carnet de suivi initialisé ! Vous pouvez maintenant tester la génération du carnet de suivi dans :\n" +
               "\"Modules complémentaires > Carnet de suivi DII Polytech > Générer\"");
      
    } catch (e) {
      handleError(e, true, "Impossible d\'initialiser le carnet de suivi.");
    }
    
  }
}


/**
* Create a folder named 'Carnet de suivi DII' in the parent folder and move the Gsheets in
*/
function setInFolder() {
  // Create new folder in parent folder
  var parentfolder = getFolderOfFileId(SpreadsheetApp.getActiveSpreadsheet().getId()); // get parent folder of the spreadsheet
  var newFolder = parentfolder.createFolder("Carnet de suivi DII"); // create new folder
  
  // Move file to the new folder
  var file = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()); // get Gsheets file
  file.getParents().next().removeFile(file); // remove file from folder
  newFolder.addFile(file); // add file to the new folder
}


/**
* Initialize template of the Gsheets (periods, end_of_course, filter...)
*/
function initGsheets() {
  
  var destinationSheet = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = SpreadsheetApp.openById(SHEET_SOURCE);
  
  destinationSheet.rename("Périodes");
  
  // Delete all sheets of the destination sheet except 1
  var sheets = destinationSheet.getSheets();
  if (sheets.length > 1) {
    for (var i = 0; i < sheets.length - 1 ;i++) {
      destinationSheet.deleteSheet(sheets[i]);
    }
  }
  
  // Get active sheet to delete after operation
  // We need always at minimum 1 sheet
  var blank_sheet = destinationSheet.getActiveSheet();
  blank_sheet.setName('Feuille 1');
  
  // Copy all sheets from source
  var sheetNames = ['filter', 'school', 'company', 'end_of_course'];
  for (var i in sheetNames) {
    sourceSheet.getSheetByName(sheetNames[i]).copyTo(destinationSheet).setName(sheetNames[i]); // Copy and rename
  }
  
  // Move filter sheet at the end
  destinationSheet.setActiveSheet(getSheetByName('filter'));
  destinationSheet.moveActiveSheet(destinationSheet.getSheets().length);
  destinationSheet.setActiveSheet(getSheetByName('school'));
  
  destinationSheet.deleteSheet(blank_sheet); // Delete active sheet saved
  
};


/**
* Initialize/replace the Google Doc template. Delete all files named '_template' and download official files '_template'
*/
function downloadGdocsTemplate() {
  
  var template = DriveApp.getFileById(DOC_SOURCE); // get official template file
  var parentFolder = getFolderOfFileId(SpreadsheetApp.getActiveSpreadsheet().getId()); // get parent folder of the spreadsheet
  
  // Make copy of the template and rename it
  var template_copy = template.makeCopy(parentFolder).setName('_template');
  
}