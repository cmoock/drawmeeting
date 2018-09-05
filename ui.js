(function () {
  init();

  function init () {
    // Displays a single status message
    dm.status = function (message) {
      // Make the new message element
      var msg = document.createElement("span");
      msg.appendChild(document.createTextNode(message));
      msg.appendChild(document.createElement("br"));

      // Get a reference to the status element
      var statusField = document.getElementById("statusField");

      // Remove previous status message
      if (statusField.childNodes.length > 0) {
        statusField.removeChild(statusField.firstChild);
      }

      // Append the new message
      statusField.appendChild(msg);

      statusField.scrollTop = statusField.scrollHeight;
    }

    dm.privateMeetingBtnListener = function (e) {
      // If the modal is opened immediately after clicking the "Make Meeting" button,
      // iOS shows the virtual keyboard, which blocks the modal most of the time. As
      // a workaround, wait 200ms before opening the modal.
      setTimeout(dm.openPrivateMeetingModal, 200);
    }

    dm.openPrivateMeetingModal = function (e) {
      var randomCode = Math.floor(Math.random()*9999);
      vex.defaultOptions.closeAllOnPopState = false;
      vex.dialog.buttons.YES.text = "Start Meeting";
      vex.dialog.buttons.NO.text = "Cancel";
      var dialog = vex.dialog.open({
        message: "Enter any meeting code:",
        input: '<input id="privateMeetingCode" type="text" class="vex-dialog-prompt-input" placeholder=' + randomCode + ' value="" ><p>Invite guests to join at:</p><p id="privateMeetingLink"></p>',
        callback: function (value) {
          if (value) {
            location.href = getMeetingLink();
            location.reload();
            return true;
          } else {
            return false;
          }
        },
        afterOpen: function () {
          updatePreviewLink();
          document.getElementById("privateMeetingCode").addEventListener("keyup", codeFieldKeyUpListener);
          document.getElementById("privateMeetingCode").addEventListener("keydown", codeFieldKeyDownListener);
        },
        beforeClose: function () {
          document.getElementById("privateMeetingCode").removeEventListener("keyup", codeFieldKeyUpListener);
          document.getElementById("privateMeetingCode").removeEventListener("keydown", codeFieldKeyDownListener);
          return true;
        }
      });

      function codeFieldKeyDownListener (event) {
        if (event.key === " " || event.key === "#" || event.key === "%"
            || event.key === "&" || event.key === "?" || event.key === "=" || event.key === "|")  {
          event.preventDefault();
          return false;
        }
      }

      function codeFieldKeyUpListener (event) {
        updatePreviewLink();
      }

      function getMeetingCode () {
        var userEnteredCode = document.getElementById("privateMeetingCode").value;
        var meetingCode = userEnteredCode === "" ? randomCode : userEnteredCode;
        return meetingCode;
      }

      function getMeetingLink () {
        return "http://drawmeeting.com/#" + getMeetingCode();
      }

      function updatePreviewLink () {
        document.getElementById("privateMeetingLink").innerText = getMeetingLink();
      }

    };

    dm.addClickListener(document.getElementById("privateMeetingBtn"), dm.privateMeetingBtnListener);
  }
})();