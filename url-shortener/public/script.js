document.getElementById('urlForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalUrl = document.getElementById('originalUrl').value;
  const resultDiv = document.getElementById('result');

  try {
    const response = await fetch('/api/url/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl })
    });
    const data = await response.json();
    resultDiv.innerHTML = `
      <p>URL encurtada: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color: red;">Erro ao encurtar URL</p>`;
  }
});