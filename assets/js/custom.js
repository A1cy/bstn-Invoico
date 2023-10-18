(function ($) {
  'use strict';

  $('#generatePDF').on('click', function (event) {
    event.preventDefault();

    var renderingWidth = 53;

    var downloadSection = $('#download_section').clone();
    $('body').append(downloadSection);
    $('#download_section').hide();

    downloadSection.css({
      'display': 'block',
      'width': renderingWidth + 'em',
      'position': 'relative',
      'overflow': 'visible'
    });

    var cWidth = downloadSection.width();
    var cHeight = downloadSection.height();

    // Adjusting the PDF height dynamically based on content height
    var pdfHeight = cHeight;
    var pdfWidth = cWidth;
    
    var canvasImageWidth = cWidth;
    var canvasImageHeight = cHeight;
    var totalPDFPages = Math.ceil(cHeight / pdfHeight) - 1;

    html2canvas(downloadSection[0], { allowTaint: true }).then(function (canvas) {
      var imgData = canvas.toDataURL('image/jpeg', 0.3);
      var pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'JPG', 0, 0, canvasImageWidth, canvasImageHeight);
      
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(pdfWidth, pdfHeight);
        pdf.addImage(imgData, 'JPG', 0, -(pdfHeight * i), canvasImageWidth, canvasImageHeight);
      }

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
      downloadSection.remove();
      $('#download_section').show();
    });
  });
})(jQuery);
