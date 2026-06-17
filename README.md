# BigQuery Release Notes Hub 🚀

A premium, interactive web application to track, search, and share Google Cloud BigQuery release updates instantly.

---

## ✨ Features
- **Live Feed Parsing:** Fetches real-time BigQuery release notes directly from the official Google Cloud XML feed.
- **Premium Dark Aesthetics:** Sleek, glassmorphic layout optimized for quick scanning, complete with responsive side drawers and glow effects.
- **Real-Time Client Filtering:** Easily filter updates by keywords in the title or content.
- **Interactive Tweet Composer:** Select any update card to automatically draft a customizable tweet, monitor the 280-character limit, and share directly to Twitter/X with one click.
- **Responsive Layout:** Works seamlessly across desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack
- **Backend:** Python 3, Flask
- **Frontend:** Vanilla HTML5, Vanilla CSS3, JavaScript (ES6)
- **Icons & Fonts:** FontAwesome v6, Google Fonts (Outfit)

---

## 🚀 Quick Start

### 1. Prerequisites
Make sure you have Python 3 installed on your system.

### 2. Setup and Installation

Clone the repository and navigate into the project directory:
```bash
git clone https://github.com/GwnDrlng/gwndrlng-event-talks-app.git
cd gwndrlng-event-talks-app
```

Create and activate a virtual environment:
```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run the App
Start the Flask development server:
```bash
python app.py
```

Open [http://127.0.0.1:5001](http://127.0.0.1:5001) in your browser to explore the dashboard!

---

## 📂 Project Structure
```text
bq-releases-notes/
├── app.py                  # Flask application routes & XML parser
├── requirements.txt        # Project dependencies
├── README.md               # User guide & documentation
├── implementation_plan.md  # Architectural blueprints
├── task.md                 # Development task checklist
├── templates/
│   └── index.html          # Dashboard HTML skeleton
└── static/
    ├── style.css           # Custom layout tokens & keyframe animations
    └── script.js           # Real-time search, UI sync & Twitter Web Intent logic
```
