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

      // Clone the downloadSection and position it off-screen
      var downloadSection = $('#download_section').clone().css({
          'display': 'block',
          'width': fixedWidth + 'px',
          'position': 'absolute',
          'left': '-5000px',  // Move it off-screen
          'top': '-5000px',
          'overflow': 'visible',
          'z-index': '-1'  // Ensure it's behind everything else
      }).appendTo('body');  // Append to body

      // Force reflow and stabilization
      downloadSection[0].offsetHeight;
      downloadSection.find('*').each(function() {
          this.offsetHeight;
      });

      setTimeout(function () {
          html2canvas(downloadSection[0], {
              useCORS: true,
              allowTaint: true,
              scale: 2,
              logging: true,
              letterRendering: true,
              taintTest: false
          }).then(function (canvas) {
              var imgData = canvas.toDataURL('image/jpeg', 1.0);
              var pdfWidth = fixedWidth;
              var pdfHeight = (fixedWidth * canvas.height) / canvas.width;
              var pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);

              pdf.addImage(imgData, 'JPG', 0, 0, pdfWidth, pdfHeight);

              var dataURI = pdf.output('datauristring');

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
      }, 1000);  // 1000ms delay
  });
})(jQuery);
