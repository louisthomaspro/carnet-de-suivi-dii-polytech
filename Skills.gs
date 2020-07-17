// Skills.gs


/**
* Show sidebar with skills
*/
function showSkillsSidebar() {
  
  try {
    sendClickEvent("showSkillsSidebar()");
    
    // First we get all skills with their occurences
    var sheet = getSheetByName('company');
    var rows = sheet.getRange("E2:E").getValues(); // get all skills already added
    var filter_rows = rows; // remove empty values
    for (var i_row in filter_rows) {
      Logger.log(filter_rows[i_row][0]);
      if (!filter_rows[i_row][0]) {
        delete filter_rows[i_row];
      }
    }
    var skills = new Object(); // will contain all skills with their occurences
    for (var i_row in filter_rows)
    {
      var row = filter_rows[i_row];
      var splits = row.toString().split("\n"); // split with "newline"
      for (var i_split in splits) { // for each skill in the row
        var split = splits[i_split];
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
    SpreadsheetApp.getUi().showSidebar(htmlOutput);

  } catch (e) {
    handleError(e, true, "Impossible d\'afficher les compétences.", "Vérifiez que votre carnet de suivi a bien été initialisé.");
  }
}

/**
* Action on click for buttons in side bar : we append the skill in the selected cell
*/
function addSkillInSelectedCells(text) {
  
  try {
    sendClickEvent("addSkillInSelectedCells()", text);
    
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
    handleError(e, true, "Impossible d'ajouter la compétence.");
  }
  
  
}