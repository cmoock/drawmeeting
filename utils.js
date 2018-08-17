var dm = {};


//==============================================================================
// EVENTS
//==============================================================================

// Register for "click" unless "touchstart" is available (special case for iPhone)
dm.addClickListener = function (obj, listener) {
  var clickEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
  obj.addEventListener(clickEvent, listener);
}
