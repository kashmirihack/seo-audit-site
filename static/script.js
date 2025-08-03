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

  fetch('/audit', {
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
  .catch(() => {
    resultDiv.innerHTML = '<p><strong>Error:</strong> Could not fetch audit result.</p>';
    downloadBtn.style.display = 'none';
  });
});

downloadBtn.addEventListener('click', function() {
  if (!auditData || !auditData.title) return;
  const doc = new jsPDF();
  doc.text(`SEO Audit Report for: ${auditData.url || ''}`, 10, 10);
  doc.text(`Title: ${auditData.title || 'Not Found'}`, 10, 20);
  doc.text(`Meta Description: ${auditData.meta_description || 'Not Found'}`, 10, 30);
  doc.text(`H1 Tag: ${auditData.h1 || 'Not Found'}`, 10, 40);
  doc.save('seo_audit_report.pdf');
});
