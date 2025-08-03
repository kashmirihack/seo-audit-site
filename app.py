from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/audit', methods=['POST'])
def audit():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'reachable': False, 'error': 'No URL provided'}), 400
    if not url.startswith('http'):
        url = 'http://' + url
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip() if soup.title and soup.title.string else "No title found"
        description_tag = soup.find("meta", attrs={"name": "description"})
        description = description_tag["content"].strip() if description_tag and "content" in description_tag.attrs else "No meta description found"
        h1_tag = soup.find("h1")
        h1 = h1_tag.get_text(strip=True) if h1_tag else "No H1 found"
        # You can add more fields as needed
        return jsonify({
            'reachable': True,
            'title': title,
            'meta_description': description,
            'h1': h1,
            'url': url
        })
    except Exception as e:
        return jsonify({'reachable': False, 'error': str(e)}), 500
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
