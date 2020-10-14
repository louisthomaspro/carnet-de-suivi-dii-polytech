// Utils.gs


///////////////////////////// SHORT FONCTIONS /////////////////////////////



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
    throw new Error('Le fichier nommé "' + name + '" est introuvable dans le dossier "' + folder.getName() + '". ' +
                    'Pour rappel, ce fichier ne doit pas être renommé ou déplacé. ');
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
  var file = DocumentApp.openById(CONSTANTS.files.table);
  var body = file.getBody(); // get official table file
  var table = body.getTables()[0]; // this is the orginal table containing merged cells
  return table;
}


/**
 * Compare 2 versions
 *
 * @return {integer} -1 if < ; 1 if > ; 0 if ==
 */
function Version(s){
  this.arr = s.split('.').map(Number);
}
Version.prototype.compareTo = function(v){
  for (var i=0; ;i++) {
    if (i>=v.arr.length) return i>=this.arr.length ? 0 : 1;
    if (i>=this.arr.length) return -1;
    var diff = this.arr[i]-v.arr[i]
    if (diff) return diff>0 ? 1 : -1;
  }
}


/**
 * HASH a message with sha512 algorithm
 */
function sha512(message) {
  var result = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, message)
  result = result.map(function(e) {
    var v = (e < 0 ? e + 256 : e).toString(16);
    return v.length == 1 ? "0" + v : v;
  }).join("");
  return result;
}