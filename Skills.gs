// Skills.gs


/**
* Show sidebar with skills
*/
function showSkillsSidebar() {
  sendClickEvent();
  
  try {
    
    // First we get all skills with their occurences
    var sheet = getSheetByName('company');
    var rows = sheet.getRange("E2:E").getValues(); // get all skills already added
    var filter_rows = [i for each (i in rows)if (isNaN(i))]; // remove empty values
    var skills = new Object(); // will contain all skills with their occurences
    for each (var row in filter_rows)
    {
      var splits = row.toString().split("\n"); // split with "newline"
      for each (var split in splits) { // for each skill in the row
        if (split in skills) { // if it's not the first time we have this skill
          skills[split]++; // add where the key is equal to skill
        } else {
          skills[split] = 1; // init skill
        }   
      }
    }
    
    // Create a html sidebar with the skills array in data
    var htmlTemplate = HtmlService.createTemplateFromFile('SkillsSidebar')
    htmlTemplate.dataFromServerTemplate = { skills: skills };
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle('Compétences').setWidth(300);
    ui.showSidebar(htmlOutput);

  } catch (e) {
    handleError("Impossible d\'afficher les compétences. ", e, "Vérifiez que votre carnet de suivi a bien été initialisé. ");
  }
}

/**
* Action on click for buttons in side bar : we append the skill in the selected cell
*/
function addSkillInSelectedCells(text) {
  sendClickEvent(text);
  
  try {
    
    var range = SpreadsheetApp.getActive().getActiveRange(); // Get selected range
    // For each cell in selected range
    var numRows = range.getNumRows();
    var numCols = range.getNumColumns();
    for (var i = 1; i <= numRows; i++) {
      for (var j = 1; j <= numCols; j++) {
        var cell = range.getCell(i,j); // get cell value
        if (cell.isBlank()) {
          cell.setValue(text); // set skill
        } else {
          cell.setValue(cell.getValue() + "\n" + text); // append skill
        }      
      }
    }
    
  } catch (e) {
    handleError("Impossible d'ajouter la compétence. ", e, "");
  }
  
  
}