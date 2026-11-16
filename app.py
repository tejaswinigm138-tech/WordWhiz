"""
WordWhiz 🌙 - Interactive Spelling & Pronunciation Tutor
Backend Server (Flask)

Features:
- Web Page Serving (`/`)
- Spelling Correction REST API (`/api/check-spelling`)
- Interactive Quiz Vocabulary Provider (`/api/quiz-words`)
- Optional Audio/Speech Recognition Fallback (`/api/voice-fallback`)
- Robust input validation and kid-friendly feedback generation
"""

import os
import re
import datetime
from flask import Flask, render_template, request, jsonify
from textblob import TextBlob

# Initialize Flask Application
app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['JSON_SORT_KEYS'] = False

# Curated Encouragement Messages for Young Learners
CORRECT_PRAISES = [
    "Fantastic job! That spelling is 100% correct! ⭐",
    "Super Star! You nailed the spelling! 🚀",
    "Brilliant work! Spotless spelling! 🎯",
    "Hoo-hoo! Barnaby is proud of you! 🦉✨",
    "Bravo! Keep shining bright! 🌟"
]

CORRECTION_ENCOURAGEMENTS = [
    "Great effort! Check out the corrected spelling below! 📚",
    "You're improving! Practice makes perfect! 💪",
    "Good try! Here is how it's spelled! ✨",
    "Almost there! Learning tricky words is fun! 🎈",
    "Keep going! Every mistake is a step towards mastery! 🏆"
]

# Curated Quiz Word Bank with Audio Clues, Definitions, and Categories
QUIZ_WORD_BANK = [
    {
        "id": 1,
        "word": "butterfly",
        "category": "Nature & Animals 🦋",
        "hint": "A colorful flying insect with large, delicate wings.",
        "difficulty": "Easy"
    },
    {
        "id": 2,
        "word": "Wednesday",
        "category": "Days of the Week 📅",
        "hint": "The day of the week that falls between Tuesday and Thursday (watch the silent 'd'!).",
        "difficulty": "Medium"
    },
    {
        "id": 3,
        "word": "beautiful",
        "category": "Descriptive Words ✨",
        "hint": "Very pleasing to look at or charming (starts with 'b-e-a-u').",
        "difficulty": "Medium"
    },
    {
        "id": 4,
        "word": "rhythm",
        "category": "Music & Sound 🎵",
        "hint": "A repeated musical beat or tempo with no normal vowels (uses 'y').",
        "difficulty": "Hard"
    },
    {
        "id": 5,
        "word": "dolphin",
        "category": "Ocean Life 🐬",
        "hint": "A very smart sea mammal known for jumping through waves.",
        "difficulty": "Easy"
    },
    {
        "id": 6,
        "word": "chocolate",
        "category": "Yummy Treats 🍫",
        "hint": "A delicious sweet food made from roasted cacao beans.",
        "difficulty": "Easy"
    },
    {
        "id": 7,
        "word": "knife",
        "category": "Silent Letters 🔪",
        "hint": "A kitchen tool used for slicing bread and fruit (starts with a silent 'k').",
        "difficulty": "Medium"
    },
    {
        "id": 8,
        "word": "necessary",
        "category": "Tricky Words 🧠",
        "hint": "Something essential that you must have (1 'c' and 2 's's!).",
        "difficulty": "Hard"
    }
]


def clean_and_correct_spelling(raw_text: str):
    """
    Cleans the input text, uses TextBlob for spelling analysis,
    preserves capitalization patterns, and tracks word-by-word differences.
    """
    cleaned_input = raw_text.strip()
    if not cleaned_input:
        return None

    # Run TextBlob spelling correction
    blob = TextBlob(cleaned_input)
    corrected_raw = str(blob.correct())

    # Maintain initial capitalization if user capitalized their input
    if cleaned_input[0].isupper() and corrected_raw:
        corrected_raw = corrected_raw[0].upper() + corrected_raw[1:]

    # Check if any change actually happened (case-insensitive check for base match)
    is_correct = (cleaned_input.strip().lower() == corrected_raw.strip().lower())

    # Build word-level comparison for educational breakdown
    original_tokens = re.findall(r"\b[\w']+\b", cleaned_input)
    corrected_tokens = re.findall(r"\b[\w']+\b", corrected_raw)

    word_diffs = []
    min_len = min(len(original_tokens), len(corrected_tokens))
    for i in range(min_len):
        orig_w = original_tokens[i]
        corr_w = corrected_tokens[i]
        if orig_w.lower() != corr_w.lower():
            word_diffs.append({
                "original": orig_w,
                "corrected": corr_w
            })

    # Pick encouragement message based on correctness
    import random
    if is_correct:
        feedback_message = random.choice(CORRECT_PRAISES)
    else:
        feedback_message = random.choice(CORRECTION_ENCOURAGEMENTS)

    return {
        "original": cleaned_input,
        "corrected": corrected_raw,
        "is_correct": is_correct,
        "message": feedback_message,
        "differences": word_diffs,
        "total_words": len(original_tokens)
    }


# ==============================================================================
# Routes
# ==============================================================================

@app.route('/')
def home():
    """Serves the main WordWhiz single-page application."""
    return render_template('index.html')


@app.route('/api/status', methods=['GET'])
def api_status():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "status": "online",
        "app": "WordWhiz 🌙",
        "version": "2.0.0",
        "british_accent_supported": True,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    })


@app.route('/api/check-spelling', methods=['POST'])
def api_check_spelling():
    """
    Receives JSON: { "text": "user input string" }
    Returns JSON: spelling analysis, corrected text, and feedback messages.
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({
                "status": "error",
                "message": "Invalid request. Please provide JSON data with a 'text' field."
            }), 400

        text = data.get('text', '')
        if not isinstance(text, str) or not text.strip():
            return jsonify({
                "status": "error",
                "message": "Please enter a word or sentence before checking!"
            }), 400

        # Perform spelling correction
        result = clean_and_correct_spelling(text)

        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Server encountered an error while analyzing spelling: {str(e)}"
        }), 500


@app.route('/api/quiz-words', methods=['GET'])
def api_quiz_words():
    """
    Returns a randomized or full set of quiz questions for the frontend arena.
    """
    import random
    words = list(QUIZ_WORD_BANK)
    random.shuffle(words)
    return jsonify({
        "status": "success",
        "total": len(words),
        "questions": words
    }), 200


@app.route('/api/voice-fallback', methods=['POST'])
def api_voice_fallback():
    """
    Backend voice recognition fallback using SpeechRecognition library
    (used if client-side browser speech API is unavailable).
    """
    try:
        import speech_recognition as sr
        recognizer = sr.Recognizer()
        
        # Check if audio file was uploaded in request
        if 'audio' not in request.files:
            return jsonify({
                "status": "error",
                "message": "No audio file received. Please use browser speech recognition or attach an audio clip."
            }), 400

        audio_file = request.files['audio']
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            recognized_text = recognizer.recognize_google(audio_data, language="en-GB")
            
            # Analyze spelling of recognized text
            result = clean_and_correct_spelling(recognized_text)
            return jsonify({
                "status": "success",
                "recognized": recognized_text,
                "data": result
            }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Voice recognition fallback error: {str(e)}"
        }), 500


if __name__ == '__main__':
    # Run the Flask development server on port 5000
    app.run(host='127.0.0.1', port=5000, debug=True)
