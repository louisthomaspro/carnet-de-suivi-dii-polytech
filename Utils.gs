// Utils.gs

///////////////////////////// SHORT FONCTIONS /////////////////////////////

/**
 * Returns parent folder of the file id. Returns 0 if not found
 *
 * @param id {String} id of the file
 * @return {Folder}
 */
function getFolderOfFileId(id) {
  var current_file = DriveApp.getFileById(id); // get current file
  var parent_folders = current_file.getParents(); // get all parent folders
  if (!parent_folders.hasNext()) { // if no parent
    Logger.log("File id '" + id + "' have no parent folder.");
    return 0;
  }
  var folder = parent_folders.next(); // get closest parent folder
  var folder_id = folder.getId(); // get folder id
  return DriveApp.getFolderById(folder_id);
}


/**
 * Returns the first file with the name in a folder. Returns 0 if not found
 *
 * @param name {String} name of the file
 * @param folder {Folder} folder where we looking
 * @return {File}
 */
function getFileByNameInFolder(name, folder) {
  var files = folder.getFilesByName(name); // get all files named 'name' in folder
  if (!files.hasNext()) { // if not found
    Logger.log("File named '" + name + "' can't be found in folder.");
    return 0;
  }
  var file = files.next();
  return file
}


/**
 * Delete all files with the name in a folder
 *
 * @param name {String} name of the file
 * @param folder {Folder} folder where we looking
 * @return {Nothing}
 */
function deleteFileByNameInFolder(name, folder) {
  var files = folder.getFilesByName(name); // get all files named 'name' in folder
  while (files.hasNext()) { // for each files
    files.next().setTrashed(true); // send file to trash
  }
}


/**
 * Delete scope with the name in a body and return his index. Return 0 if not found
 *
 * @param body {body} body of the document
 * @param name {string} : name of the scope
 * @return {int}
 */
function getScope(body, name) {
  var rangeElement = body.findText("{{" + name + "}}"); // find scope
  if (!rangeElement) {
    return 0;
  }
  var element = rangeElement.getElement();
  var parent = element.getParent(); // get parents
  var index = body.getChildIndex(parent); // get index
  parent.removeFromParent(); // delete scope
  return index;
}


/**
 * Returns the official table which is a header fusion
 *
 * @return {table}
 */
function getFusionTableHeader() {
  var file = DocumentApp.openById(TABLE_SOURCE);
  var body = file.getBody(); // get official table file
  var table = body.getTables()[0]; // this is the orginal table containing merged cells
  return table;
}


/**
 * Get variables in cache and return a JSON value
 *
 * @param key {string} Google Sheets api key
 * @return {JSON.parse(string)} Object or string
 */
function getJsonCache(key) {
  return JSON.parse(CacheService.getUserCache().get(key));
}
