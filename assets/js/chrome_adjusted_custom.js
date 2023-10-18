
// Detect mobile Chrome browser
function isMobileChrome() {
  return /Android.*Chrome/.test(navigator.userAgent);
}

// Detect Safari browser
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

(function ($) {
  'use strict';

  $('#generatePDF').on('click', function (event) {
    event.preventDefault();

    var renderingWidth = 59;

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
    var topLeftMargin = 0;
    var pdfWidth = cWidth + topLeftMargin * 2;
    // Set the pdfHeight dynamically based on content height, while maintaining the width-to-height ratio
    var pdfHeight = cHeight + topLeftMargin * 2;

    
    if (isMobileChrome()) {
      pdfWidth *= 0.8;  // Adjusting width for mobile Chrome
      pdfHeight *= 0.8; // Adjusting height for mobile Chrome
    }

    var totalPDFPages = Math.ceil(cHeight / pdfHeight) - 1;

    html2canvas(downloadSection[0], { allowTaint: true }).then(function (canvas) {
      var imgData = canvas.toDataURL('image/jpeg', 0.7);
      var pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'JPG', topLeftMargin, topLeftMargin, cWidth, cHeight);
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(pdfWidth, pdfHeight);
        pdf.addImage(imgData, 'JPG', topLeftMargin, -(pdfHeight * i) + topLeftMargin, cWidth, cHeight);
      }

      var dataURI = pdf.output('datauristring');
    // Safari specific download handling
    if (isSafari()) {
      var blob = pdf.output('blob');
      var blobURL = window.URL.createObjectURL(blob);
      window.location.href = blobURL;
      return;
    }
    
    
      var link = document.createElement('a');
      link.href = dataURI;
      link.download = 'MHG-Sales-invoice.pdf';
      document.body.appendChild(link);
      link.click();
      setTimeout(function() {
        link.click();  // Triggering the download again after a short delay
      }, 50);
      document.body.removeChild(link);
    

    }).catch(function (error) {
      alert("Error generating PDF: " + error.message);
    }).finally(function () {
      downloadSection.remove();
    });
  });
})(jQuery);
