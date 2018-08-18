(function () {
  init();

  function init () {
    console.log("Gallery init()")
    dm.addClickListener(document.getElementById("saveDrawingBtn"), saveClickListener);
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
    var url = 'https://drawmeeting-service.herokuapp.com/screenshots';
    // var payload = JSON.stringify({data: canvasData});
    var payload = "data=" + canvasData;
    request.open('POST', url, true);

    //Send the proper header information along with the request
    //request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        console.log(request.responseText);
      }
    }
    request.send(payload);
  }

})();