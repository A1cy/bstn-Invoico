$('#generatePDF').on('click', function (event) {
  event.preventDefault();
  
  // Just try to download a simple text file
  var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "hello.txt");
});
