(function ($) {
  'use strict';

  $('#generatePDF').on('click', function (event) {
    event.preventDefault();

    // Clone the original section
    var downloadSection = $('#download_section').clone();

    // Append the clone to the body and hide the original
    $('body').append(downloadSection);
    $('#download_section').hide();

    // Adjust styles for the clone to simulate a large screen view
    downloadSection.css({
      'display': 'block',
      'width': '1520px', // Simulating a large screen width
      'position': 'absolute', // For capturing content
      'overflow': 'visible', // Ensure all content is visible
      // Add any other styles here to override mobile-specific styles
    });

    // Force a reflow
    downloadSection[0].offsetHeight;

    var cWidth = downloadSection.width();
    var cHeight = downloadSection.height();
    var topLeftMargin = 0;
    var pdfWidth = cWidth + topLeftMargin * 2;
    var pdfHeight = pdfWidth * 1.5 + topLeftMargin * 2;
    var canvasImageWidth = cWidth;
    var canvasImageHeight = cHeight;
    var totalPDFPages = Math.ceil(cHeight / pdfHeight) - 1;

    html2canvas(downloadSection[0], { allowTaint: true }).then(function (canvas) {
      // Adjust styles for the clone for download
      downloadSection.css({
        'position': 'absolute', // For download
        'top': '-5000px'  // Position it out of view
      });

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
      // Remove the clone and show the original section
      downloadSection.remove();
      $('#download_section').show();
    });
  });
})(jQuery);
