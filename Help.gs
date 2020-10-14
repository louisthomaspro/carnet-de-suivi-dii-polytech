/**
 * Show help dialog
 */
function help() {
  var ui = SpreadsheetApp.getUi();
  
  var html_output = HtmlService
  .createHtmlOutput('Si vous rencontrez un problème, vous pouvez créer une "Issue" sur <a target="_blank" href="https://github.com/louisthomaspro/carnet-de-suivi-dii-polytech">Github</a> ou me contacter : louisthomas.pro@gmail.com.')
    .setWidth(500)
    .setHeight(50);
  SpreadsheetApp.getUi().showModalDialog(html_output, 'Aide');
  
  sendEvent("click", { "function": "help()" });
  
}
