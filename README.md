# WordWhiz 🌙 – Interactive Spelling & Pronunciation Tutor

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/Theme-Midnight_Night_Sky-7B2CBF?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **WordWhiz** is a modern, child-friendly English spelling and British pronunciation learning web application. Designed for young learners, it combines intelligent natural language spelling correction, microphone voice dictation, authentic British English pronunciation playback (`en-GB`), and an interactive spelling quiz with Barnaby the Owl 🦉.

---

## 📸 Screenshots

| 🌙 Night Sky Spelling Station | 🎯 Interactive Quiz Arena |
|:---:|:---:|
| ![Spelling Station](https://via.placeholder.com/600x380/161233/ffffff?text=WordWhiz+Spelling+Station) | ![Quiz Arena](https://via.placeholder.com/600x380/161233/ffffff?text=Interactive+Spelling+Quiz) |

---

## ✨ Features

- **🌙 Enchanting Night Theme**:
  - Deep midnight purple and navy color palette.
  - Realistic glowing moon and multi-layered twinkling starfield animations.
  - Barnaby the Owl mascot 🦉 with floating animations, friendly speech bubbles, and interactive tips.

- **✏️ Intelligent Spelling Checker**:
  - Type individual English words or full sentences.
  - Powered by **TextBlob** natural language processing on the Flask backend.
  - Side-by-side comparison grid highlighting original typos versus corrected spelling.
  - Positive affirmation and celebratory confetti for flawless spellings.

- **🎙️ Voice Microphone Input**:
  - Dictate words or sentences using the browser's native **Web Speech API**.
  - Real-time listening indicator with pulsing audio ripples.
  - Automatically sends recognized speech to the spelling engine.
  - Explicit distinction between speech recognition, spelling correction, and pronunciation playback.

- **🇬🇧 British English Pronunciation Player**:
  - Native **SpeechSynthesis API** configured with British English (`en-GB`) voice preference (e.g., George, Hazel, UK English).
  - Variable speed control:
    - 🐢 **Slow (0.75x)** for dissecting difficult syllables and silent letters.
    - 🌟 **Normal (0.9x)** tailored for young children.
    - 🐇 **Fast (1.0x)** for conversational practice.

- **🎯 Gamified Spelling Quiz Arena**:
  - Mystery word challenges across categories: *Nature & Animals*, *Days of the Week*, *Silent Letters*, and *Tricky Words*.
  - Audio prompts: "Hear Word to Spell" and "Hear Slowly".
  - Instant visual validation with cheering messages (*"Great Job!"*, *"You're Improving!"*).
  - Celebratory completion screen with a bouncing gold trophy 🏆 and victory confetti cannon.

- **📊 Live Score Dashboard**:
  - Tracks total points (+10 for correct, +5 for improvement), streak counters, and correct vs. improved counts.
  - Persistent progress saved to browser `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5 (Semantic Structure), CSS3 (Custom Variables, Flexbox/Grid, Keyframes), JavaScript (ES6+ Vanilla), Canvas Confetti |
| **Backend** | Python 3.11+, Flask Web Framework |
| **Spelling Engine** | TextBlob (Natural Language Toolkit / Edit Distance) |
| **Speech-to-Text** | Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) + Backend `SpeechRecognition` fallback |
| **Text-to-Speech** | Browser `SpeechSynthesis` API with British English (`en-GB`) voice priority |
| **Assets** | Custom Vector SVG Mascot (`owl.svg`), Google Fonts (*Fredoka* & *Nunito*) |

---

## 📂 Project Structure

```
WordWhiz/
│
├── app.py                      # Flask REST backend server
├── requirements.txt            # Python package dependencies
├── test_wordwhiz.py            # Automated test suite (8 test cases)
├── README.md                   # Project documentation
│
├── static/                     # Static client-side assets
│   ├── css/
│   │   └── style.css           # Night theme, glassmorphism, animations
│   ├── js/
│   │   └── script.js           # Client logic, speech APIs, quiz & score engine
│   └── images/
│       └── owl.svg             # Barnaby the Owl vector mascot
│
└── templates/
    └── index.html              # Main single-page application template
```

---

## 🚀 Getting Started

Follow these steps to run **WordWhiz** locally on your computer:

### 1. Prerequisites
- **Python 3.8+** installed ([Download Python](https://www.python.org/downloads/))
- A modern browser with Web Speech API support (**Google Chrome**, **Microsoft Edge**, or **Safari**)
- A working microphone (for voice recognition) and speakers/headphones

### 2. Clone or Download the Repository
```bash
git clone https://github.com/your-username/wordwhiz.git
cd wordwhiz
```

### 3. Create a Virtual Environment *(Recommended)*
```powershell
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run the Application
```bash
python app.py
```

Open your web browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 🧪 Running the Automated Tests

WordWhiz includes a test suite covering template rendering, spelling logic, quiz endpoints, and static asset delivery:

```powershell
python test_wordwhiz.py
```

Expected output:
```text
Ran 8 tests in 0.27s
OK
PASS: Home page rendered successfully.
PASS: API status health check returned online.
PASS: Spelling correction successfully corrected 'defanitely' -> 'definitely'.
PASS: Correct word 'wonderful' verified without unnecessary changes.
PASS: Blank text submission correctly rejected with HTTP 400.
PASS: Sentence correction: 'I can spel very well' -> 'I can spell very well'.
PASS: Quiz bank supplied 8 verified questions with hints.
PASS: Static CSS, JavaScript, and SVG mascot assets serve properly.
```

---

## 🔮 Future Enhancements

- [ ] Multi-accent toggle (switch between British 🇬🇧, American 🇺🇸, and Australian 🇦🇺 English).
- [ ] Phonics syllable visualizer highlighting prefixes, roots, and suffixes.
- [ ] Custom spelling list creator for teachers and parents.
- [ ] Downloadable printable achievement certificates with Barnaby the Owl.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Made with 💜 for young learners exploring the magic of English words! 🦉🌙
