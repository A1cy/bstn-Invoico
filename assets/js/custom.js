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

      var fixedWidth = 1024;  // This represents a typical desktop width
      var downloadSection = $('#download_section').clone();
      $('body').append(downloadSection);
      $('#download_section').hide();

      downloadSection.css({
          'display': 'block',
          'width': fixedWidth + 'px',  // Set to fixed width
          'position': 'relative',
          'overflow': 'visible'
      });

      var cWidth = downloadSection.width();
      var cHeight = downloadSection.height();
      var topLeftMargin = 0;
      var pdfWidth = cWidth + topLeftMargin * 2;
      var pdfHeight = cHeight + topLeftMargin * 2;

      if (isMobileChrome()) {
          pdfWidth *= 0.8;  // Adjusting width for mobile Chrome
          pdfHeight *= 0.8; // Adjusting height for mobile Chrome
      }

      var totalPDFPages = Math.ceil(cHeight / pdfHeight) - 1;

      // Introduce a short delay before capturing the content
      setTimeout(function () {
          html2canvas(downloadSection[0], {
              allowTaint: true,
              scale: 2  // Increase resolution
          }).then(function (canvas) {
              var imgData = canvas.toDataURL('image/jpeg', 1.0);  // Set maximum quality
              var pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);

              // Dynamic scaling based on actual width and height
              var scale_factor = Math.min(pdfWidth / cWidth, pdfHeight / cHeight);
              cWidth *= scale_factor;
              cHeight *= scale_factor;

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

              document.body.removeChild(link);

          }).catch(function (error) {
              alert("Error generating PDF: " + error.message);
          }).finally(function () {
              downloadSection.remove();
          });
      }, 300);  // 300ms delay, adjust as needed
  });
})(jQuery);
