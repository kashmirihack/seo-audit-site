const form = document.getElementById('seoForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const url = document.getElementById('urlInput').value.trim();
  if (!url) {
    alert('Please enter a URL');
    return;
  }

  // Backend API call with your Render.com URL
  fetch('https://seo-audit-site.onrender.com/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url })
  })
  .then(response => response.json())
  .then(data => {
    if(data.reachable) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `
        <p><strong>Website is reachable.</strong></p>
        <p><strong>Title:</strong> ${data.title || 'No Title Found'}</p>
        <p><strong>Meta Description:</strong> ${data.meta_description || 'No Meta Description Found'}</p>
        <p><strong>H1 Tag:</strong> ${data.h1 || 'No H1 Tag Found'}</p>
      `;
    } else {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `<p><strong>Website not reachable.</strong></p><p>Error: ${data.error}</p>`;
    }
  })
  .catch(error => {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<p><strong>Error:</strong> ${error.message}</p>`;
  });
});
