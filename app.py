import os
import urllib.request
import xml.etree.ElementTree as ET
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def fetch_and_parse_feed():
    try:
        req = urllib.request.Request(
            FEED_URL, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        # Parse XML
        root = ET.fromstring(xml_data)
        
        # Atom feed namespace usually: {http://www.w3.org/2005/Atom}
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        entries = []
        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns)
            updated = entry.find('atom:updated', ns)
            content = entry.find('atom:content', ns)
            link = entry.find('atom:link', ns)
            id_val = entry.find('atom:id', ns)
            
            title_text = title.text if title is not None else "No Title"
            updated_text = updated.text if updated is not None else ""
            content_text = content.text if content is not None else ""
            link_href = link.attrib.get('href', '') if link is not None else ""
            id_text = id_val.text if id_val is not None else ""
            
            entries.append({
                'id': id_text,
                'title': title_text,
                'updated': updated_text,
                'content': content_text,
                'link': link_href
            })
            
        return entries, None
    except Exception as e:
        return [], str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes')
def get_notes():
    notes, error = fetch_and_parse_feed()
    if error:
        return jsonify({'error': error, 'notes': []}), 500
    return jsonify({'notes': notes})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
