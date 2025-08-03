from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def seo_audit(url):
    result = {}
    try:
        if not url.startswith('http'):
            url = 'http://' + url
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            result['reachable'] = True
            soup = BeautifulSoup(response.text, 'html.parser')
            result['title'] = soup.title.string if soup.title else None
            meta_desc = soup.find('meta', attrs={'name':'description'})
            result['meta_description'] = meta_desc['content'] if meta_desc else None
            h1 = soup.find('h1')
            result['h1'] = h1.text.strip() if h1 else None
        else:
            result['reachable'] = False
            result['error'] = f"Status code: {response.status_code}"
    except Exception as e:
        result['reachable'] = False
        result['error'] = str(e)
    return result

@app.route('/audit', methods=['POST'])
def audit():
    data = request.get_json()
    url = data.get('url')
    audit_result = seo_audit(url)
    return jsonify(audit_result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
