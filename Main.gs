// Main.gs


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
//  contact : louisthomas.pro@gmail.com
//  project : https://gitlab.com/louisthomaspro/carnet-de-suivi-dii.git


/********** CONSTANTS **********/

// DO NOT CHANGE THIS !!!
var CONSTANTS = {
  version: "1.2.0",
  files: {
    template: '1SKabJkPDKdWfKwGBJrqdd9bJe_yr50DatJJ6wPH8upQ',
    table: '18FDN1lCA1RRYVE8JMBIOBuzQaJK8y6tYKsCl58opfyI'
  }
}

/******************************/





/********** EVENTS **********/

/**
 * When document was opened, we create the user menu
 */
function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu('Carnet de suivi DII Polytech') // Add a new option in the Google Sheets Add-ons Menu
  .addItem("Générer", 'generate')
  .addItem('Afficher les compétences', 'showSkillsSidebar')
  .addSeparator()
  .addItem("Intialiser", 'initialize')
  .addSeparator()
  .addItem("Notifications", 'handleNotifications')
  .addItem("Aide", 'help')
  .addToUi();
}


/**
 * [Trigger configuration] When the Gsheet has just been edited
 * We send an event every 10min to analyse user activity
 */
function editTrigger() {
  if (!CacheService.getScriptCache().get("edit")) {
    CacheService.getScriptCache().put("edit", true, 600) // 10min
    sendEvent("edit", {});
  }
}


/**
 * [Triggerconfiguration] When the Gsheet has just been opened
 * To show user notification
 */
function openTrigger() {
  handleNotifications();
}

/******************************/



