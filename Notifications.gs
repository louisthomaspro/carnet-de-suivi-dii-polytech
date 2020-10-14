/**
 * Display new notifications in a sidebar
 */
function handleNotifications() {
  const firestore = getDatabase();
  const firestore_notifications = firestore.getDocument("parameters/notifications").obj.array; // All notifications stored in firestore
  var sidebar = "<hr>"; // Html to display in sidebar
  var new_notifications = false; // If we open the sidebar
  
  var user_properties_notifications = [];
  try {
    user_properties_notifications = JSON.parse(PropertiesService.getUserProperties().getProperty("notifications_keys"));
    if (user_properties_notifications == null) user_properties_notifications = [];
  } catch (e) {}
  
  firestore_notifications.sort((a, b) => parseInt(b.sort) - parseInt(a.sort));
  
  for (var fn in firestore_notifications) {
    var n = firestore_notifications[fn];
    
    if (!user_properties_notifications.includes(n.md5_key) && n.enable == true) {
      var show_notification = false;
      
      if ((new Version(CONSTANTS.version)).compareTo(new Version(n.show_version)) == 0) show_notification = true; // if document version is same as notification version
      if (n.anterior_versions && (new Version(CONSTANTS.version)).compareTo(new Version(n.show_version)) == -1) show_notification = true; // if document version is lower than notification version
      
      if (show_notification) {
        new_notifications = true;
        sidebar += "<div id='" + n.md5_key + "'>";
        sidebar += "<div>" + n.html_message + "</div>";
        sidebar += '<input type="button" value="Hide" onclick="google.script.run.hideNotification(\'' + n.md5_key + '\');document.getElementById(\'' + n.md5_key + '\').style.display=\'none\';"/>';
        sidebar += "<hr>";
        sidebar += "</div>"
        sendEvent("notification", { "md5_key": n.md5_key } );
      }
    }
  }
  
  if (new_notifications) {
    var html_output = HtmlService
    .createHtmlOutput(sidebar)
    .setTitle('Notifications');
    SpreadsheetApp.getUi().showSidebar(html_output);
  }
}


/**
 * Create a database instance
 *
 * @param key {String} Notification key to hide
 */
function hideNotification(key) {
  var user_properties_notifications = [];
  try {
    user_properties_notifications = JSON.parse(PropertiesService.getUserProperties().getProperty("notifications_keys"));
    if (user_properties_notifications == null) user_properties_notifications = [];
  } catch (e) {}
  
  user_properties_notifications.push(key);
  PropertiesService.getUserProperties().setProperty("notifications_keys", JSON.stringify(user_properties_notifications));
}


/**
 * Clear all notifications keys in UserProperties
 * Used to debug
 */
function clearNotificationProperties() {
  PropertiesService.getUserProperties().deleteProperty("notifications_keys");
}
