// Generation.gs

// GENERATE THE TRACKING BOOK
// Delete all files names '_generated'
// Copy '_template' file rename to '_generated' and add data from Gsheets
// 


/**
* Generate the tracking book
*/
function generate() {
  
  try {
    
    var ui = SpreadsheetApp.getUi();
    var folder = getFolderOfFileId(SpreadsheetApp.getActiveSpreadsheet().getId()); // get parent folder of the spreadsheet
    var template = getFileByNameInFolder('_template', folder); // get Gdocs '_template'
    
    // File not initialized ?
    if (template==0) {
      ui.alert("Impossible de générer le carnet de suivi : fichier '_template' manquant. Réinitialisez votre projet !");
      return 0;
    }
    if (SpreadsheetApp.getActiveSpreadsheet().getSheets().length < 2) {
      ui.alert("Impossible de générer le carnet de suivi : Google Sheets non initialisé. Réinitialisez votre projet !");
      return 0;
    }
    
    var ts_begin = new Date().getTime(); // Number of ms since Jan 1, 1970
    CacheService.getUserCache().put('ts_begin', JSON.stringify(ts_begin));
    
    deleteFileByNameInFolder('_generated', folder); // delete all Gdocs '_generated' existing
    
    // create a copy of Gdocs '_template' and rename to '_generated'
    var file = template.makeCopy().setName('_generated');
    var generated = DocumentApp.openById(file.getId()); // get Gdocs '_generated' DocumentApp
    
    // Replace scopes
    add_period(generated, "school");
    add_period(generated, "company");
    add_table(generated, "end_of_course");
    
    
    // Calculation of the execution time of the function
    var ts_begin = getJsonCache('ts_begin');
    var ts_end = new Date().getTime();
    var time = (ts_end - ts_begin) / 1000;
    
    var htmlOutput = HtmlService
    .createHtmlOutput('Lien du fichier : <a target="_blank" href="https://docs.google.com/document/d/' + file.getId() + '/edit">\'_generated\'</a>' +
      '<br><span style="font-size:12px;color:#797979;">Time : ' + JSON.stringify(time) + 's</span>')
      .setWidth(250)
      .setHeight(50);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Carnet de suivi généré !');
    
  } catch (e) {
    console.error(e.message + e.stack);
    SpreadsheetApp.getUi().alert('Impossible de générer le carnet de suivi. Merci de reporter l\'erreur "Carnet de suivi DII > Help > Report an issue".');
  }
  
}


/**
* Generate the period in the doc
* This function insert table by table always at the same index. We begin by the end of the period.
*
* @param doc {documentApp} destination
* @param period {string} selected period
* @return {Nothing}
*/
function add_period(doc, period) {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(period);
  
  var body = doc.getBody();
  var index = getScope(body, period);
  var numRows = sheet.getLastRow(); // get number of rows not empty except header
  var tablerow;
  var table;
  var synthese; // paragraph header of synthese
  var week_number = -1; // actual week during loop
  var row; // informations from spreadsheet
  var end_week_number = -1;
  var fusionTableHeader = getFusionTableHeader(); // get table gdoc (template) with fusion for the table header
  var new_week = false;
  
  var rows = sheet.getRange(2,1,numRows-1, 5).getValues(); // get all info at one time
  
  
  for (var i = rows.length - 1; i >= 0; i--) { // for each row beginning with the end
    
    row = rows[i]; // get row
    
    // if synthese, update last synthese we saved
    if (i == 0 || row[1] == "Synthèse / Bilan") {
      if (synthese) {
        synthese.setText("Synthèse / Bilan période " + ((i==0) ? row[0] : week_number) + " à " + end_week_number);
      }
    }
    
    // if synthese, add header, text and pagebreak
    if (row[1] == "Synthèse / Bilan") { // add synthese
      
      body.insertPageBreak(index);
      var text = (period == "school") ? row[4] : row[3];
      body.insertParagraph(index, text);
      body.insertParagraph(index, "\n");
      synthese = body.insertParagraph(index, "").setHeading(DocumentApp.ParagraphHeading.HEADING2); // save synthese to update synthese value after
      end_week_number = row[0]; // save end_week_number to update synthese value after
      
    } else { // not synthese
      
      if (week_number != row[0]) { // if we changed week we add a new table
        
        week_number = row[0];
        
        body.insertParagraph(index, "\n");
        table = body.insertTable(index, fusionTableHeader.copy()); // add table
        
        table.getRow(0).getCell(0).setText("Semaine n°" + week_number).setBold(true);
        table.getRow(1).setBold(true);
        
        if (period == "school") {
          table.getRow(1).getCell(0).setText("Intitulé du cours").setWidth(118);
          table.getRow(1).getCell(1).setText("Notions abordées").setWidth(159);
          table.getRow(1).getCell(2).setText("Auto-évaluation").setWidth(65);
          table.getRow(1).getCell(3).setText("Commentaires").setWidth(113);
        } else {
          table.getRow(1).getCell(0).setText("Activité prévue").setWidth(118);;
          table.getRow(1).getCell(1).setText("Activité réalisée").setWidth(100);
          table.getRow(1).getCell(2).setText("Commentaires").setWidth(150);
          table.getRow(1).getCell(3).setText("Compétence mise en oeuvre").setWidth(90);
        }
        
      }
      
      // Add row to the table
      tablerow = table.insertTableRow(2).setBold(false);
      tablerow.appendTableCell(row[1]);
      tablerow.appendTableCell(row[2]);
      tablerow.appendTableCell(row[3]);
      tablerow.appendTableCell(row[4]);
      
    } // add table
    
  } // end for
  
}

/**
* Generate a simple table in the doc with a header and 2 column
*
* @param doc {documentApp} destination
* @param period {string} selected period
* @return {Nothing}
*/
function add_table(doc, period) {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(period);
  
  var body = doc.getBody();
  var index = getScope(body, period);
  var numRows = sheet.getLastRow();
  var table = body.insertTable(index);
  
  var row = sheet.getRange(1, 1, 1, 2).getValues()[0]; // row, column, numrows, numcolumns
  
  var tr = table.appendTableRow().setBold(true);
  tr.appendTableCell(row[0]).setWidth(120).setBackgroundColor("#efefef");
  tr.appendTableCell(row[1]).setWidth(330).setBackgroundColor("#efefef");
  
  
  for (var i = 2; i <= numRows; i++) { // for each row, add values to table
    
    var row = sheet.getRange(i, 1, 1, 2).getValues()[0]; // row, column, numrows, numcolumns
    
    var tablerow = table.appendTableRow().setBold(false);
    tablerow.appendTableCell(row[0]);
    tablerow.appendTableCell(row[1]);
    
  }
  
}

