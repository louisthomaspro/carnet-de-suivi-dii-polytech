function help() {
  var ui = SpreadsheetApp.getUi();
  
  var htmlOutput = HtmlService
  .createHtmlOutput('Si vous rencontrez un problème, vous pouvez créer une "Issue" sur <a href="https://github.com/louisthomaspro/carnet-de-suivi-dii-polytech">Github</a> ou me <a href="https://louisthomas.pro/">contacter</a>.')
    .setWidth(500) //optional
    .setHeight(50); //optional
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Aide');
  
}
