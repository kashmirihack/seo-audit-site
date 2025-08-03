const form = document.getElementById('seoForm');
const resultDiv = document.getElementById('result');
const downloadBtn = document.getElementById('downloadPdfBtn');

let auditData = {}; // Store audit result for PDF

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const url = document.getElementById('urlInput').value.trim();
  if (!url) {
    alert('Please enter a URL');
    return;
  }

  resultDiv.innerHTML = "<p>Loading audit...</p>";
  resultDiv.style.display = 'block';
  downloadBtn.style.display = 'none';

  fetch('https://seo-audit-site.onrender.com/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url })
  })
  .then(response => response.json())
  .then(data => {
    if (data.reachable) {
      auditData = data; // Save for PDF

      resultDiv.innerHTML = `
        <h3>SEO Audit Result for: ${url}</h3>
        <p><strong>Title:</strong> ${data.title || 'Not Found'}</p>
        <p><strong>Meta Description:</strong> ${data.meta_description || 'Not Found'}</p>
        <p><strong>H1 Tag:</strong> ${data.h1 || 'Not Found'}</p>
      `;
      downloadBtn.style.display = 'inline-block';
    } else {
      resultDiv.innerHTML = `<p><strong>Error:</strong> ${data.error || 'Website not reachable'}</p>`;
      downloadBtn.style.display = 'none';
    }
  })
  .catch(error => {
    resultDiv.innerHTML = `<p><strong>Error:</strong> ${error.message}</p>`;
    downloadBtn.style.display = 'none';
  });
});

downloadBtn.addEventListener('click', function () {
  const { title, meta_description, h1 } = auditData;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("SEO Audit Report", 20, 20);
  doc.setFontSize(12);
  doc.text(`Title: ${title || 'Not Found'}`, 20, 40);
  doc.text(`Meta Description: ${meta_description || 'Not Found'}`, 20, 60);
  doc.text(`H1 Tag: ${h1 || 'Not Found'}`, 20, 80);

  doc.save('SEO_Audit_Report.pdf');
});
