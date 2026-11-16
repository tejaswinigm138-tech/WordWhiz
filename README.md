# WordWhiz 🌙 – Interactive Spelling & Pronunciation Tutor

[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3%2B-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Night_Theme-7B2CBF?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

> **WordWhiz** is an interactive web application designed to help children learn English spelling and master standard British English (`en-GB`) pronunciation. Built with a lightweight Python Flask backend and a modern vanilla HTML5/CSS3/JavaScript frontend, it features automated spelling correction, speech-to-text dictation, voice synthesis, and a gamified spelling quiz led by Barnaby the Owl mascot 🦉.

---

## 📸 Screenshots

> *Add your screenshots to `docs/screenshots/` and update these paths when ready.*

| 🌙 Night Sky Spelling Station | 🎯 Interactive Quiz Arena |
| :---: | :---: |
| ![Spelling Station Screenshot Placeholder](docs/screenshots/spelling-station.png) | ![Quiz Arena Screenshot Placeholder](docs/screenshots/quiz-arena.png) |

---

## ✨ Features

### 1. ✏️ Dual-Input Spelling Correction
- **Text Input**: Type words or full sentences into the input box and click **Check Spelling** or press `Enter`.
- **Backend NLP Engine**: Uses Python's `TextBlob` library on the Flask backend to detect spelling mistakes and return accurate corrections.
- **Side-by-Side Comparison**: Displays the original input alongside the corrected version in a comparison grid.
- **Visual Feedback**:
  - Displays a green `✅ Perfect Spelling!` badge and confetti celebration when the spelling is already correct.
  - Displays an amber `✨ Spelling Improved!` badge when corrections are applied.
  - Displays dynamic, encouraging messages tailored for young learners.
- **Quick Controls**: Dedicated buttons to **Clear text (✖)** and **Try Again (🔄)**.

### 2. 🎙️ Voice Recognition (Web Speech API)
- Click **Speak into Mic 🎤** to dictate words or sentences aloud.
- Real-time listening indicator with a pulsing ripple animation banner.
- Spoken words are transcribed into the text box and automatically sent to the spelling correction engine.
- Graceful error handling for microphone permissions (`not-allowed`), silence (`no-speech`), and unsupported browsers.
- Explicit distinction between speech recognition (dictation), spelling correction (orthography), and pronunciation playback (acoustics).

### 3. 🔊 British English (`en-GB`) Pronunciation Player
- Uses the browser's native **SpeechSynthesis API** configured with a British English voice preference (e.g., George, Hazel, or UK English).
- Live voice status pill in the top navigation bar indicating the active British voice.
- Adjustable playback speed control:
  - 🐢 **Slow (0.75x)**: Helps children sound out tricky syllables and silent letters.
  - 🌟 **Normal (0.9x)**: Comfortable learning speed for kids.
  - 🐇 **Fast (1.0x)**: Standard speaking rate.

### 4. 🎯 Interactive Spelling Quiz Arena
- Curated question bank categorized by themes: *Nature & Animals*, *Days of the Week*, *Descriptive Words*, *Silent Letters*, and *Tricky Words*.
- Audio challenge: Children click **Hear Word to Spell (🔊)** or **Hear Slowly (🐢)** to listen before spelling.
- Helpful clue descriptions and hints for each question.
- Instant feedback box highlighting correct answers or explaining mistakes.
- Progress bar and question counter tracking progress through the 5-question round.
- Quiz completion screen with a bouncing gold trophy 🏆, final score summary, celebratory confetti, and a **Play Again** option with freshly shuffled questions.

### 5. 📊 Milestone Score Dashboard
- Dynamically tracks:
  - ⭐ **Total Points**: +10 points for correct spellings, +5 points for learning from corrections.
  - ✅ **Correct Words**: Count of flawlessly spelled words.
  - 💡 **Words Improved**: Count of corrected words learned.
  - 🔥 **Current Streak**: Consecutive correct answers.
- State persists across page refreshes using browser `localStorage`.
- Includes a **Reset Score Dashboard** option.

### 6. 🎨 Child-Friendly Night Theme & Mascot
- Deep purple and navy night sky theme with animated twinkling stars and a glowing moon.
- Frosted glassmorphism cards and smooth button hover effects.
- **Barnaby the Owl 🦉**: Custom vector SVG mascot with floating animations, dynamic speech bubbles, and interactive trivia when clicked.

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | [Flask](https://flask.palletsprojects.com/) (Python) | Serves web pages and handles REST API routes |
| **Spelling Correction** | [TextBlob](https://textblob.readthedocs.io/) | Spelling evaluation and text analysis |
| **Speech-to-Text** | Web Speech API (`SpeechRecognition`) | Browser-native voice dictation |
| **Text-to-Speech** | Web Speech API (`SpeechSynthesis`) | British English (`en-GB`) audio pronunciation |
| **Voice Fallback** | [SpeechRecognition](https://pypi.org/project/SpeechRecognition/) (Python) | Optional server-side speech recognition fallback |
| **Frontend UI** | HTML5, CSS3, JavaScript (ES6+ Vanilla) | Responsive single-page application without heavy frameworks |
| **Visual Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Celebratory victory animations |
| **Typography** | Google Fonts (*Fredoka*, *Nunito*) | Legible, friendly typography for children |

---

## 📂 Project Structure

```text
WordWhiz/
├── app.py                      # Flask backend application and REST API routes
├── requirements.txt            # Python dependencies
├── test_wordwhiz.py            # Automated test suite (8 integration tests)
├── README.md                   # Project documentation
├── static/                     # Static frontend assets
│   ├── css/
│   │   └── style.css           # Custom styling, night theme, and animations
│   ├── js/
│   │   └── script.js           # Client logic, speech APIs, quiz & scoring engine
│   └── images/
│       └── owl.svg             # Barnaby the Owl vector mascot graphic
└── templates/                  # Jinja2 HTML templates
    └── index.html              # Main application single-page layout
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to run WordWhiz locally.

### 1. Prerequisites
- **Python 3.8 or higher** installed ([Download Python](https://www.python.org/downloads/))
- A modern web browser with Web Speech API support (**Google Chrome**, **Microsoft Edge**, or **Safari**)
- A microphone (for voice dictation) and speakers/headphones (for pronunciation playback)

### 2. Clone the Repository

Clone the project using your terminal:

```bash
git clone https://github.com/tejaswinigm138-tech/WordWhiz.git
cd WordWhiz
```

---

### 3. Set Up a Virtual Environment (Recommended)

Choose the commands for your operating system:

#### Option A: Windows PowerShell
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
> *Note: If script execution is disabled on your system, run this command once:*
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

#### Option B: Windows Command Prompt (cmd)
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

#### Option C: macOS / Linux Terminal
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 4. Install Dependencies

Install the required Python packages specified in [`requirements.txt`](requirements.txt):

```bash
pip install -r requirements.txt
```

The application relies on:
- `Flask>=2.3.0`
- `textblob>=0.17.1`
- `SpeechRecognition>=3.10.0`

---

### 5. Run the Application

Start the Flask development server:

```bash
python app.py
```

Expected output:
```text
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

## 🧪 Automated Testing

WordWhiz includes an automated test suite in [`test_wordwhiz.py`](test_wordwhiz.py) that validates template rendering, API endpoints, spelling correction logic, and static assets.

Run the tests using:

```bash
python test_wordwhiz.py
```

### Verified Test Cases:
1. `test_01_home_page_rendering`: Verifies the single-page application loads with HTTP 200 and all sections.
2. `test_02_api_status_healthcheck`: Verifies the `/api/status` endpoint returns `online`.
3. `test_03_check_spelling_misspelled`: Confirms typos (e.g., `"defanitely"`) are corrected to `"definitely"` with `is_correct: false`.
4. `test_04_check_spelling_already_correct`: Confirms correct words (e.g., `"wonderful"`) are recognized with `is_correct: true`.
5. `test_05_check_spelling_validation_empty`: Confirms whitespace or empty inputs return an HTTP 400 error.
6. `test_06_check_spelling_sentence`: Confirms sentence-level spelling correction (`"I can spel very well"` ➔ `"I can spell very well"`).
7. `test_07_quiz_words_endpoint`: Confirms the quiz bank supplies randomized questions with hints and category tags.
8. `test_08_static_assets_serving`: Confirms `style.css`, `script.js`, and `owl.svg` are served with HTTP 200.

Expected output:
```text
Ran 8 tests in 0.21s
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

- [ ] Multi-accent selector (support American English `en-US` and Australian English `en-AU` alongside British English `en-GB`).
- [ ] Phonics syllable visualizer breaking words into syllables, prefixes, and suffixes.
- [ ] Custom word list builder for parents and educators.
- [ ] Printable achievement certificates featuring Barnaby the Owl.

---

## 📄 License

This repository does not currently contain a license file. If you plan to distribute or open-source this project publicly on GitHub, consider adding a license (such as the [MIT License](https://choosealicense.com/licenses/mit/)).

---

*Made for young learners discovering the fun in English spelling and pronunciation! 🦉🌙*
