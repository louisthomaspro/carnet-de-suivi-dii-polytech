// Override.gs


// Here we override existing google app script function to create better error messages


function getSheetByName(sheetname) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetname);
  if (sheet == null) {
    throw new Error(customError('La feuille nommé "' + sheetname + '" est introuvable. ' +
                    'Pour rappel, cette feuille ne doit pas être renommée ou déplacée. '));
  }
  return sheet;
}