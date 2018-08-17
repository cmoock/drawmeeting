(function () {
  init();
  
  //==============================================================================
  // INITIALIZATION
  //==============================================================================
  function init () {
    document.getElementById("chatOut").onkeydown = function () {
      if (event.keyCode == 13) sendMessage();
    };

    dm.addClickListener(document.getElementById("chatSend"), sendMessage);

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
    displayChatMessage("Joining chat...");
  
    appRoom = orbiter.getRoomManager().getRoom(appRoomID);
    if (orbiter.self().isInRoom(appRoomID)) {
      displayReady();
    }
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
    appRoom.addEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);  
    
    // Listen for chat messages
    appRoom.addMessageListener("CHAT_MESSAGE", chatMessageListener);
    
    // Join the chat room
    appRoom.join();
  }
  
  function displayReady () {
    displayChatMessage("Chat ready.");
  }
  
  //==============================================================================
  // CHAT ROOM EVENT LISTENERS
  //==============================================================================
  // Triggered when the room is joined
  function joinRoomListener (e) {
    displayReady();
  }
  
  // Triggered when another client joins the chat room
  function addOccupantListener (e) {
    if (appRoom.getSyncState() != net.user1.orbiter.SynchronizationState.SYNCHRONIZING) { 
      displayChatMessage(getScreenName(e.getClient()) + " joined.");
    }
  }
    
  // Triggered when another client leaves the chat room
  function removeOccupantListener (e) {
    displayChatMessage(getScreenName(e.getClient())  + " left.");
  }
    
  //==============================================================================
  // CHAT SENDING AND RECEIVING
  //==============================================================================
  // Sends a chat message to everyone in the chat room
  function sendMessage () {
    var outgoing = document.getElementById("chatOut");
    if (outgoing.value.length > 0) {
      appRoom.sendMessage("CHAT_MESSAGE", "true", null, outgoing.value);
      outgoing.value = "";
      // Focus text field again after submission (required for IE8 only)
      setTimeout(function () {outgoing.focus();}, 10);
    }
  }
  
  // Triggered when a chat message is received
  function chatMessageListener (fromClient, message) {
    displayChatMessage(getScreenName(fromClient) + ": " + message);
  }
  
  // Displays a single chat message
  function displayChatMessage (message) {
    // Add links to message
    var messageWithLinks = anchorme(message,{truncate:[50,50]});

    // Make the new chat message element
    var msg = document.createElement("div");
    msg.className = "chatMessage diagonalGradient";
    msg.insertAdjacentHTML( 'beforeend', messageWithLinks );
  
    // Append the new message to the chat
    var chatPane = document.getElementById("chatPane");
    chatPane.appendChild(msg);
    
    // Trim the chat to 5000 messages
    if (chatPane.childNodes.length > 5000) {
      chatPane.removeChild(chatPane.firstChild);
    }
    chatPane.scrollTop = chatPane.scrollHeight;
  }

  function getScreenName (client) {
    var screenName = client.getAttribute("screenName");
    return screenName ? screenName : "Guest" + client.getClientID();
  }
})();
