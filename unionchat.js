(function () {
  init();
  
  //==============================================================================
  // INITIALIZATION
  //==============================================================================
  function init () {
    document.getElementById("chatOut").onkeydown = function () {
      if (event.keyCode == 13) {
        handleSendInput();
        return false;  // Prevent default behavior
      }
    };

    dm.addClickListener(document.getElementById("chatSend"), handleSendInput);

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
      setTimeout(function () {
        // Workaround: Delay 1 second to allow the client that just joined time to set its name
        // from local storage.
        displayChatMessage(dm.getScreenName(e.getClient()) + " joined.");
      }, 1000);
    }
  }
    
  // Triggered when another client leaves the chat room
  function removeOccupantListener (e) {
    displayChatMessage(dm.getScreenName(e.getClient()) + " left.");
  }

  //==============================================================================
  // CHAT SENDING AND RECEIVING
  //==============================================================================
  function handleSendInput () {
    if (hasName()) {
      sendMessage();
    } else {
      requestName();
    }
  }

  // Checks if the user has specified a name. If not, prompts for one.
  function requestName () {
    vex.defaultOptions.closeAllOnPopState = false;
    vex.dialog.buttons.NO.text = "Continue as a Guest";
    vex.dialog.buttons.YES.text = "OK";
    var dialog = vex.dialog.open({
      message: "What's your name?",
      input: '<input name="newScreenName" type="text" class="vex-dialog-prompt-input" placeholder="" value="" >',
      callback: function (value) {
        if (value) {
          if (value.newScreenName !== "") {
            dm.setName(value.newScreenName);
          }
        } else {
          localStorage.removeItem("screenName");
          // Future: also remove screenname client attribute
        }
        sendMessage();
      }
    });
  }

  function hasName () {
    var name = localStorage.getItem("screenName");
    return name != null;
  }

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
    displayChatMessage(dm.getScreenName(fromClient) + ": " + message);
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
})();
