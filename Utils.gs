// Utils.gs


///////////////////////////// SHORT FONCTIONS /////////////////////////////




/**
 * Return the function name of the caller
 *
 * @param n {String} n th parent. (ex : n=1 will be the function where getCaller is called)
 */
function getCaller(n)
{
  var nth = 2; 
  if (n !== undefined) {
    nth = nth + n;
  }
  var stack;
  var ret = "";
    try {
      throw new Error("Whoops!");
    } catch (e) {
      stack = e.stack;
    } finally {
      var matchArr = stack.match(/\(.*\)/g);
      if (matchArr.length > 2) {
        tmp = matchArr[nth];
        ret = tmp.slice(1, tmp.length - 1) + "()";
      }
      return ret;
    }
}


/**
 * Return true if the string in parameter can be parsed
 *
 * @param str {String} test if this variable can be parsed
 */
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


/**
 * Return the length of the variable after UTF-8 encoding
 *
 * @param str {String} we want to calcul the length of this variable
 */
function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}


/**
 * Returns parent folder of the file id. Returns 0 if not found
 *
 * @param id {String} id of the file
 * @return {Folder}
 */
function getFolderOfFileId(id) {
  var current_file = DriveApp.getFileById(id); // get current file
  var parent_folders = current_file.getParents(); // get all parent folders
  var folder = parent_folders.next(); // get closest parent folder
  return folder;
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
    throw new Error(customError('Le fichier nommé "' + name + '" est introuvable dans le dossier "' + folder.getName() + '". ' +
                    'Pour rappel, ce fichier ne doit pas être renommé ou déplacé. '));
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
function deleteFilesByNameInFolder(name, folder) {
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
function getScope(doc, name) {
  var body = doc.getBody();
  var scope = "{{" + name + "}}";
  var rangeElement = body.findText(scope); // find scope
  if (!rangeElement) {
    console.warn('Le scope "' + scope + '" est introuvable dans le document "' + doc.getName() + '".');
    return -1;
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
