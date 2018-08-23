(function () {
  init();

  function init () {
    console.log("Gallery init()")
    API_URL = "http://api.drawmeeting.com/"

    dm.addClickListener(document.getElementById("saveDrawingBtn"), saveClickListener);
    loadDrawings();
  }

  function saveClickListener () {
    saveDrawingToServer(canvas.toDataURL("image/png"));
  }

  function getScreenshot () {
    var canvas = document.getElementById("canvas");
    var canvasData = canvas.toDataURL("image/png");
    var gallery = document.getElementById("gallery");

    var img = new Image();
    img.src = canvasData;
    img.style["max-width"] = "100%";
    img.style["max-height"] = "100%";
    img.style["margin-top"] = "5px";
    gallery.insertBefore(img, gallery.firstChild);
  }

  function saveDrawingToServer (canvasData) {
    var request = new XMLHttpRequest();
    var url = 'http://api.drawmeeting.com/screenshots';
    // var payload = JSON.stringify({data: canvasData});
    var payload = "data=" + encodeURIComponent(canvasData);
    request.open('POST', url, true);

    console.log("CANVAS STRING: " + canvasData)
    //Send the proper header information along with the request
    //request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
      }
    }
    request.send(payload);
  }

  function loadDrawings () {
    var request = new XMLHttpRequest();
    var url = API_URL + 'screenshots';
    request.open('GET', url, true);
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var drawings = JSON.parse(request.responseText);
        console.log(drawings)

        var gallery = document.getElementById("gallery");
        var img;

        console.log("SERVER STRING: " +  drawings[drawings.length-1].data)

        for (var i = 0; i < drawings.length; i++) {
          img = new Image();
          img.onerror = function() {console.log("Error attempting to parse gallery image: " + i)};
          img.onabort = function() {console.log("Aborted loading image: " + i)};
          img.src = drawings[i].data;
          img.style["max-width"] = "100%";
          img.style["max-height"] = "100%";
          img.style["margin-top"] = "5px";
          gallery.insertBefore(img, gallery.firstChild);
        }
      }
    }
    request.send();
  }
})();