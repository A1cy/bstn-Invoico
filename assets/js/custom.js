
(function ($) {
  'use strict';

  $('#generatePDF').on('click', function (event) {
    event.preventDefault();

    // Determine device width and set the rendering width accordingly
    var deviceWidth = $(window).width();
    var renderingWidth = deviceWidth < 1068 ? deviceWidth : 1520;  // 768px is a common breakpoint for mobile devices

    // Clone the original section
    var downloadSection = $('#download_section').clone();

    // Append the clone to the body and hide the original
    $('body').append(downloadSection);
    $('#download_section').hide();

    // Adjust styles for the clone
    downloadSection.css({
      'display': 'block',
      'width': renderingWidth + 'px',
      'position': 'relative',
      'overflow': 'visible'
    });

    var cWidth = downloadSection.width();
    var cHeight = downloadSection.height();
    var topLeftMargin = 0;
    var pdfWidth = cWidth + topLeftMargin * 2;
    var pdfHeight = pdfWidth * 1.5 + topLeftMargin * 2;
    var canvasImageWidth = cWidth;
    var canvasImageHeight = cHeight;
    var totalPDFPages = Math.ceil(cHeight / pdfHeight) - 1;

    html2canvas(downloadSection[0], { allowTaint: true }).then(function (canvas) {
      var imgData = canvas.toDataURL('image/jpeg', 0.5);
      var pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'JPG', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(pdfWidth, pdfHeight);
        pdf.addImage(imgData, 'JPG', topLeftMargin, -(pdfHeight * i) + topLeftMargin, canvasImageWidth, canvasImageHeight);
      }

      // Use the data URI scheme for initiating the download on mobile
      var dataURI = pdf.output('datauristring');
      var link = document.createElement('a');
      link.href = dataURI;
      link.download = 'MHG-Sales-invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }).catch(function (error) {
      alert("Error generating PDF: " + error.message);
    }).finally(function () {
      // Remove the clone and show the original section
      downloadSection.remove();
      $('#download_section').show();
    });
  });
})(jQuery);
