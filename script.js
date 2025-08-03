const form = document.getElementById('auditForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const url = document.getElementById('urlInput').value.trim();
  if (!url) {
    alert('Please enter a URL');
    return;
  }

  // For demo, just show the URL entered
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `<p>SEO audit request received for: <strong>${url}</strong></p>
  <p><em>Backend integration needed to fetch audit results.</em></p>`;

  // Here you can add code to send this URL to your backend server (e.g. using fetch/AJAX)
});
