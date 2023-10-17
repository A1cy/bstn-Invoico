(function ($) {
  'use strict';

  $('#generatePDF').on('click', function (event) {
    event.preventDefault();

    var downloadSection = $('#download_section');

    // Store the original styles
    var originalWidth = downloadSection.css('width');
    var originalVisibility = downloadSection.css('visibility');

    // Apply styles for large screen view
    downloadSection.css({
      'width': '1520px',
      'visibility': 'visible'
    });

    html2canvas(downloadSection[0], { allowTaint: true }).then(function (canvas) {
      var imgData = canvas.toDataURL('image/jpeg', 0.5);
      var pdf = new jsPDF('p', 'pt', [1520, 2280]); // Assuming an aspect ratio similar to A4
      pdf.addImage(imgData, 'JPG', 0, 0, 1520, canvas.height * (1520 / canvas.width));

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
        'width': originalWidth,
        'visibility': originalVisibility
      });
    });
  });
})(jQuery);
