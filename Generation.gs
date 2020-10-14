// Generation.gs


// GENERATE THE TRACKING BOOK
// Delete all files names '_generated'
// Copy '_template' file rename to '_generated' and add data from Gsheets


/**
* Generate the tracking book
*/
function generate() {
   
  try {
    
    var folder = getFolderOfFileId(SpreadsheetApp.getActiveSpreadsheet().getId()); // get parent folder of the spreadsheet
    var template = getFileByNameInFolder('_template', folder); // get Gdocs '_template'
    
    var ts_begin = new Date().getTime(); // Number of ms since Jan 1, 1970
    
    deleteFilesByNameInFolder('_generated', folder); // delete all Gdocs '_generated' existing
    
    // create a copy of Gdocs '_template' and rename to '_generated'
    var file = template.makeCopy().setName('_generated');
    var generated = DocumentApp.openById(file.getId()); // get Gdocs '_generated' DocumentApp
    
    // Replace scopes
    add_period(generated, "school");
    add_period(generated, "company");
    
    
    // Calculation of the execution time of the function
    var ts_end = new Date().getTime();
    var duration_ms = ts_end - ts_begin
    var duration_s = duration_ms / 1000;
    
    var htmlOutput = HtmlService
    .createHtmlOutput('Lien du fichier : <a target="_blank" href="https://docs.google.com/document/d/' + file.getId() + '/edit">\'_generated\'</a>' +
      '<br><span style="font-size:12px;color:#797979;">Time : ' + JSON.stringify(duration_s) + 's</span>')
      .setWidth(250)
      .setHeight(50);
    sendEvent("click", { "function": "generate()", "duration_ms": duration_ms });
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Carnet de suivi généré !');
    
  } catch (e) {
    sendEvent("click", { "function": "generate()" }, e);
    return handleError(e, "Impossible de générer le carnet de suivi. Vérifiez que votre carnet de suivi a bien été initialisé.");
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

  var index = getScope(doc, period);
  if (index == -1) return; // if scope not found, stop
  
  var sheet_period = getSheetByName(period);
  var body = doc.getBody();
  
  var num_rows_period = sheet_period.getLastRow(); // get number of rows not empty except header
  var tablerow;
  var table;
  var synthese; // paragraph header of synthese
  var week_number = -1; // actual week during loop
  var row; // informations from spreadsheet
  var end_week_number = -1;
  var fusionTableHeader = getFusionTableHeader(); // get table gdoc (template) with fusion for the table header
  var new_week = false;
  
  var rows_period = sheet_period.getRange(2,1,num_rows_period-1, 5).getValues(); // get all info at one time
  var json_end_of_course = {};
  
  // if period school then get end_of_course data and parse to json to retrieve it easily
  if (period == "school") {
    var sheet_end_of_course = getSheetByName("end_of_course");    
    var num_rows_end_of_couse = sheet_end_of_course.getLastRow();
    var rows_end_of_course = sheet_end_of_course.getRange(2,1,num_rows_end_of_couse-1, 4).getValues(); // get all info at one time
    
    for (var i in rows_end_of_course) { 
      if (json_end_of_course[rows_end_of_course[i][0]] == undefined) json_end_of_course[rows_end_of_course[i][0]] = [];
      json_end_of_course[rows_end_of_course[i][0]].push({
        "subject": rows_end_of_course[i][1],
        "comment": rows_end_of_course[i][2],
        "mark": rows_end_of_course[i][3]
      });
    }  
  }
 
  
  
  
  for (var i = rows_period.length - 1; i >= 0; i--) { // for each row beginning with the end
    
    row = rows_period[i]; // get row
    
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
        
        body.insertPageBreak(index);
        
        
        // add end of course
        if (week_number in json_end_of_course) {
          
          // Create and configure table
          var table_eoc = body.insertTable(index);
          table_eoc.setBorderColor('#ffffff');
          
          for (var sub in json_end_of_course[week_number]) { // add new row for every subjects
            var text = table_eoc.appendTableRow().appendTableCell().appendParagraph("").editAsText();
            text.appendText(json_end_of_course[week_number][sub]["subject"] + " (" + json_end_of_course[week_number][sub]["mark"] + ")\n");
            var endOffsetInclusive = text.getText().length - 1;
            text.appendText(json_end_of_course[week_number][sub]["comment"]);
            text.setBold(0, endOffsetInclusive, true);
          }
          body.insertParagraph(index, "Synthèse de fin de cours semaine " + week_number)
              .setAttributes(body.getHeadingAttributes(DocumentApp.ParagraphHeading.HEADING3)); // apply the heading3 style
        }
        
        
        
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
  
  var index = getScope(doc, period);
  if (index == -1) return; // if scope not found, stop
  
  var sheet = getSheetByName(period);
  var body = doc.getBody();
  
  var numRows = sheet.getLastRow();
  var table = body.insertTable(index);
  
  var row = sheet.getRange(1, 1, 1, 3).getValues()[0]; // row, column, numrows, numcolumns
  
  var tr = table.appendTableRow().setBold(true);
  tr.appendTableCell(row[0]).setWidth(120).setBackgroundColor("#efefef");
  tr.appendTableCell(row[1]).setWidth(270).setBackgroundColor("#efefef");
  tr.appendTableCell(row[2]).setWidth(60).setBackgroundColor("#efefef");
  
  
  for (var i = 2; i <= numRows; i++) { // for each row, add values to table
    
    var row = sheet.getRange(i, 1, 1, 3).getValues()[0]; // row, column, numrows, numcolumns
    
    var tablerow = table.appendTableRow().setBold(false);
    tablerow.appendTableCell(row[0]);
    tablerow.appendTableCell(row[1]);
    tablerow.appendTableCell(row[2]);
    
  }
  
}

