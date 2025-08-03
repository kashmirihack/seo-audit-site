from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/audit', methods=['POST'])
def audit():
    data = request.get_json()
    url = data.get('url')
    
    if not url.startswith('http'):
        url = 'http://' + url
    
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title = soup.title.string if soup.title else "No title found"
        
        description_tag = soup.find("meta", attrs={"name": "description"})
        description = description_tag["content"] if description_tag and "content" in description_tag.attrs else "No meta description found"
        
        h1_tags = soup.find_all("h1")
        h1_count = len(h1_tags)
        h1_texts = [tag.get_text(strip=True) for tag in h1_tags]
        
        h2_tags = soup.find_all("h2")
        h2_count = len(h2_tags)
        h2_texts = [tag.get_text(strip=True) for tag in h2_tags]

        # SEO score (very basic mock logic)
        score = 100
        if title == "No title found":
            score -= 20
        if description == "No meta description found":
            score -= 20
        if h1_count == 0:
            score -= 10

        return jsonify({
            "title": title,
            "description": description,
            "h1_count": h1_count,
            "h1_texts": h1_texts,
            "h2_count": h2_count,
            "h2_texts": h2_texts,
            "score": score
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
