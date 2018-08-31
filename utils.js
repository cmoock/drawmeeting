var dm = {};

dm.removeChildren = function (obj) {
  while (obj.firstChild) {
    obj.removeChild(obj.firstChild);
  }
}

//==============================================================================
// EVENTS
//==============================================================================

// Register for "click" unless "touchstart" is available (special case for iPhone)
dm.addClickListener = function (obj, listener) {
  var clickEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
  obj.addEventListener(clickEvent, listener);
}

//==============================================================================
// ORBITER
//==============================================================================
dm.getScreenName = function (client) {
  var screenName = client.getAttribute("screenName");
  return screenName ? screenName : "Guest" + client.getClientID();
}
