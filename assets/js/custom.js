(function ($) {
  'use strict';

  $('#generatePDF').on('click', function (event) {
    event.preventDefault();

    var downloadSection = $('#download_section');

    // Temporarily adjust styles for PDF generation
    downloadSection.css({
      'visibility': 'visible',
      'position': 'static',
      'width': '1520px' // Simulating a large screen width
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

      var blob = pdf.output('blob');
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'MHG-Sales-invoice.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }).catch(function (error) {
      console.error("Error generating PDF:", error);
    }).finally(function () {
      // Revert the styles back to their original state
      downloadSection.css({
        'visibility': 'hidden',
        'position': 'absolute',
        'top': '0',
        'left': '100%',
        'width': 'auto'
      });
    });
  });
})(jQuery);
