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
    // Create the chat room on the server
    appRoom = orbiter.getRoomManager().getRoom(appRoomID);
    if (orbiter.self().isInRoom(appRoomID)) {
      populateList();
    }
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE, updateClientAttributeListener);

    document.getElementById("username").addEventListener("keydown", usernameKeyDownListener);
    document.getElementById("setNameBtn").addEventListener("click", setNameClickListener);
  }

  //==============================================================================
  // ROOM EVENT LISTENERS
  //==============================================================================
  // Triggered when a client joins the room
  function addOccupantListener (e) {
    var client = e.getClient();
    var screenName = client.getAttribute("screenName");
    screenName = screenName || "Guest" + client.getClientID();
    console.log(orbiter.self())
    if (client === orbiter.self()) {
      screenName += " (You)";
    }

    addListOption(screenName, e.getClientID());
  }
    
  // Triggered when a client leaves the room
  function removeOccupantListener (e) {
    removeListOption(e.getClientID());
  }

  // Triggered when a client attribute changes on a client the room
  function updateClientAttributeListener (e) {
    if (e.getChangedAttr().name === "screenName") {
      changeListOption(e.getClientID(), e.getChangedAttr().value
        + (e.getClient() === orbiter.self() ? " (You)" : ""));
    }
  }

  //==============================================================================
  // UI EVENT LISTENERS
  //==============================================================================
  function setNameClickListener () {
    handleSetName();
  }

  function usernameKeyDownListener (e) {
    if (e.keyCode == 13) {
      handleSetName();
    }
  }

  function handleSetName () {
    var newUsername = document.getElementById("username").value;
    setName(newUsername);
    document.getElementById("username").value = "";
  }

  //==============================================================================
  // USERNAME MANAGEMENT
  //==============================================================================
  function setName (value) {
    if (value && value !== "") {
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
    var occupants = appRoom.getOccupants();
    for (var i = 0; i < occupants.length; i++) {
      addListOption ("User" + occupants.getClientID());
    }
  }
  
  function clearList () {
    var node = document.getElementById("userList");
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }
})();
