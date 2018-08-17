(function () {
  init();

  function init () {
    console.log("Gallery init()")
    document.getElementById("saveDrawingBtn").addEventListener("click", function () {
      getScreenshot();
    });
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

})();