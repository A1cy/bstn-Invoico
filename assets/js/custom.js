(function ($) {
  'use strict';

  $('#generatePDF').on('click', function () {
    var downloadSection = $('#download_section');

    // Temporarily display the section for PDF generation
    downloadSection.css('display', 'block');

    // Store the original width and set a fixed width for large screen
    var originalWidth = downloadSection.width();
    downloadSection.css('width', '1920px');

    var cWidth = downloadSection.width();
    var cHeight = downloadSection.height();
    var topLeftMargin = 0;
    var pdfWidth = cWidth + topLeftMargin * 2;
    var pdfHeight = pdfWidth * 1.5 + topLeftMargin * 2;
    var canvasImageWidth = cWidth;
    var canvasImageHeight = cHeight;
    var totalPDFPages = Math.ceil(cHeight / pdfHeight) - 1;

    html2canvas(downloadSection[0], { allowTaint: true }).then(function (canvas) {
      var imgData = canvas.toDataURL('image/jpeg', 1.0);
      var pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'JPG', topLeftMargin, topLeftMargin, canvasImageWidth, canvasImageHeight);
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(pdfWidth, pdfHeight);
        pdf.addImage(imgData, 'JPG', topLeftMargin, -(pdfHeight * i) + topLeftMargin * 0, canvasImageWidth, canvasImageHeight);
      }

      // Create a blob from the PDF and use an object URL to download
      var blob = pdf.output('blob');
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'MHG-Sales-invoice.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }).catch(function (error) {
      console.error("Error generating PDF:", error);
    }).finally(function () {
      // Revert the width back to its original state and hide the section
      downloadSection.css('width', originalWidth + 'px');
      downloadSection.css('display', 'none');
    });
  });
})(jQuery);
