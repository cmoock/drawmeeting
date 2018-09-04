(function () {
  init();
  
  //==============================================================================
  // VARIABLES
  //==============================================================================
  var appRoom;
  
  //==============================================================================
  // INITIALIZATION
  //==============================================================================
  function init () {
    orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, readyListener, this);
    
    // If Orbiter has already connected, start this component
    if (orbiter.isReady()) {
      start();
    }
  }

  // Triggered when the connection to Union Server is ready  
  function readyListener (e) {
    start();
  }
  
  // Start this component
  function start () {
    dm.setName(localStorage.getItem("screenName"));

    // Create the chat room on the server
    appRoom = orbiter.getRoomManager().getRoom(appRoomID);
    populateList();
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.LEAVE, leaveRoomListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE, updateClientAttributeListener);
  }
  //==============================================================================
  // ROOM EVENT LISTENERS
  //==============================================================================
  function joinRoomListener (e) {
    populateList();
  }

  function leaveRoomListener (e) {
    populateList();
  }

  function addOccupantListener (e) {
    populateList();
  }

  function removeOccupantListener (e) {
    populateList();
  }

  // Triggered when a client attribute changes on a client the room
  function updateClientAttributeListener (e) {
    if (e.getChangedAttr().name === "screenName") {
      changeListOption(e.getClientID(), e.getChangedAttr().value
        + (e.getClient() === orbiter.self() ? " (You)" : ""));
    }
  }

  //==============================================================================
  // USERNAME MANAGEMENT
  //==============================================================================
  dm.setName = function (value) {
    if (value && value !== "") {
      localStorage.setItem('screenName', value);
      orbiter.self().setAttribute("screenName", value);
    }
  }

  //==============================================================================
  // LIST MANAGEMENT
  //==============================================================================
  function addListOption (name, value) {
    var li = document.createElement("li");
    li.className = "userlistItem";
    li.id = value;
    li.appendChild(document.createTextNode(name));
  
    // Append the new message to the chat
    var userlist = document.getElementById("userList");
    userlist.appendChild(li);
  }
  
  function removeListOption (value) {
    var list = document.getElementById("userList");
    var listItems = list.getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
      if (listItems[i].id == value) {
        list.removeChild(listItems[i]);
        return;
      }
    }
  }

  function changeListOption (id, value) {
    var list = document.getElementById("userList");
    var listItems = list.getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
      if (listItems[i].id === id) {
        listItems[i].innerHTML = value;
        return;
      }
    }
  }
  
  function populateList () {
    clearList();
    if (appRoom && orbiter.self().isInRoom(appRoomID)) {
      var occupants = appRoom.getOccupants();
      for (var i = 0; i < occupants.length; i++) {
        addListOption (dm.getScreenName(occupants[i])
                       + (occupants[i] === orbiter.self() ? " (You)" : ""), occupants[i].getClientID());

      }
    }
  }
  
  function clearList () {
    var node = document.getElementById("userList");
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }
})();
