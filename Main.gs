// Code.gs



// http://patorjk.com/software/taag/#p=display&f=Big&t=Carnet%20de%20suivi%20DII
//
//   _____                      _         _                  _       _   _____ _____ _____ 
//  / ____|                    | |       | |                (_)     (_) |  __ \_   _|_   _|
// | |     __ _ _ __ _ __   ___| |_    __| | ___   ___ _   _ ___   ___  | |  | || |   | |  
// | |    / _` | '__| '_ \ / _ \ __|  / _` |/ _ \ / __| | | | \ \ / / | | |  | || |   | |  
// | |___| (_| | |  | | | |  __/ |_  | (_| |  __/ \__ \ |_| | |\ V /| | | |__| || |_ _| |_ 
//  \_____\__,_|_|  |_| |_|\___|\__|  \__,_|\___| |___/\__,_|_| \_/ |_| |_____/_____|_____|
//                                                                                         
//                                                                                                                     
//  by louisthomas.pro
//  contact : https://louisthomas.pro/
//  project : https://gitlab.com/louisthomaspro/carnet-de-suivi-dii.git


/********** CONSTANTS **********/

var SHEET_SOURCE = '1WPh-suzqGs0-yr6TLgcCdhJ6qB_R6T9LzXF7-4qLtec'; // https://docs.google.com/spreadsheets/d/1WPh-suzqGs0-yr6TLgcCdhJ6qB_R6T9LzXF7-4qLtec/edit
var DOC_SOURCE = '1Y-wco8Hti8Fn3BlYzhK4CxvN7-tx_J3HjPRF-RoEZQM'; // https://docs.google.com/document/d/1Y-wco8Hti8Fn3BlYzhK4CxvN7-tx_J3HjPRF-RoEZQM/edit
var TABLE_SOURCE = '1j_WQbZ0p0nSnbF1d-VtYtKxmn6R0LIL7KohZY9-b4XE'; // https://docs.google.com/document/d/1j_WQbZ0p0nSnbF1d-VtYtKxmn6R0LIL7KohZY9-b4XE/edit

var GA_TRACKING_ID = 'UA-93751383-4';

/******************************/





/********** EVENTS **********/

// When the Gsheet has just been opened
function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu('Carnet de suivi DII Polytech') // Add a new option in the Google Sheets Add-ons Menu
  .addItem("Générer", 'generate')
  .addItem('Afficher les compétences', 'showSkillsSidebar')
  .addSeparator()
  .addItem("Intialiser", 'initialize')
  .addSeparator()
  .addItem("Aide", 'help')
  .addToUi();
  
}

/******************************/




