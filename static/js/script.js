/**
 * WordWhiz 🌙 - Interactive Spelling & Pronunciation Tutor
 * Client-Side Application Script
 * 
 * Step 6 Focus:
 * - Text input handling and validation
 * - Backend API communication (`/api/check-spelling`)
 * - Dynamic result rendering & comparison view
 * - Barnaby the Owl Mascot reactions
 * - Input clearing and resetting
 */

// ==============================================================================
// 1. Application State & Global Variables
// ==============================================================================
const AppState = {
  // Current active word being inspected
  currentWord: "",
  correctedWord: "",
  isCorrect: false,

  // User Stats & Learning Dashboard
  stats: {
    totalScore: 0,
    correctCount: 0,
    improvedCount: 0,
    currentStreak: 0
  },

  // Audio & Voice
  britishVoice: null,
  isRecording: false,
  recognition: null,

  // Quiz Engine
  quiz: {
    questions: [],
    currentIndex: 0,
    points: 0,
    isActive: false
  }
};

// ==============================================================================
// 2. DOM Elements
// ==============================================================================
const DOM = {
  // Navigation & Pills
  soundStatusPill: document.getElementById('soundStatusPill'),

  // Mascot Elements
  mascotBubble: document.getElementById('mascotBubble'),
  mascotMessage: document.getElementById('mascotMessage'),
  owlMascot: document.getElementById('owlMascot'),

  // Tutor / Spelling Elements
  textInput: document.getElementById('textInput'),
  clearBtn: document.getElementById('clearBtn'),
  checkSpellingBtn: document.getElementById('checkSpellingBtn'),
  voiceBtn: document.getElementById('voiceBtn'),
  voiceBtnText: document.getElementById('voiceBtnText'),
  listenPronounceBtn: document.getElementById('listenPronounceBtn'),
  tryAgainBtn: document.getElementById('tryAgainBtn'),
  voiceStatusBanner: document.getElementById('voiceStatusBanner'),
  voiceStatusText: document.getElementById('voiceStatusText'),

  // Result Card Elements
  resultCard: document.getElementById('resultCard'),
  statusBadge: document.getElementById('statusBadge'),
  encouragingQuote: document.getElementById('encouragingQuote'),
  originalTextDisplay: document.getElementById('originalTextDisplay'),
  correctedTextDisplay: document.getElementById('correctedTextDisplay'),
  speakResultBtn: document.getElementById('speakResultBtn'),
  speechRate: document.getElementById('speechRate'),

  // Quiz Elements
  quizCategoryBadge: document.getElementById('quizCategoryBadge'),
  questionCounter: document.getElementById('questionCounter'),
  quizCurrentPoints: document.getElementById('quizCurrentPoints'),
  progressBarFill: document.getElementById('progressBarFill'),
  quizQuestionBody: document.getElementById('quizQuestionBody'),
  clueTitle: document.getElementById('clueTitle'),
  clueDescription: document.getElementById('clueDescription'),
  quizHintText: document.getElementById('quizHintText'),
  quizPlayAudioBtn: document.getElementById('quizPlayAudioBtn'),
  quizSlowAudioBtn: document.getElementById('quizSlowAudioBtn'),
  quizAnswerInput: document.getElementById('quizAnswerInput'),
  quizSubmitBtn: document.getElementById('quizSubmitBtn'),
  quizFeedbackBox: document.getElementById('quizFeedbackBox'),
  quizFeedbackIcon: document.getElementById('quizFeedbackIcon'),
  quizFeedbackTitle: document.getElementById('quizFeedbackTitle'),
  quizFeedbackMessage: document.getElementById('quizFeedbackMessage'),
  quizNextBtn: document.getElementById('quizNextBtn'),
  quizCompleteScreen: document.getElementById('quizCompleteScreen'),
  finalScoreDisplay: document.getElementById('finalScoreDisplay'),
  completeMessage: document.getElementById('completeMessage'),
  restartQuizBtn: document.getElementById('restartQuizBtn'),

  // Dashboard Elements
  dashboardTotalScore: document.getElementById('dashboardTotalScore'),
  dashboardCorrectCount: document.getElementById('dashboardCorrectCount'),
  dashboardImprovedCount: document.getElementById('dashboardImprovedCount'),
  dashboardStreak: document.getElementById('dashboardStreak'),
  resetScoreBtn: document.getElementById('resetScoreBtn')
};

// ==============================================================================
// 3. Owl Mascot Reaction Engine
// ==============================================================================
function setMascotMessage(message) {
  if (DOM.mascotMessage) {
    DOM.mascotMessage.textContent = message;
    DOM.mascotBubble.style.animation = 'none';
    // Trigger DOM reflow to restart animation
    void DOM.mascotBubble.offsetWidth;
    DOM.mascotBubble.style.animation = 'floatBubble 4s ease-in-out infinite alternate';
  }
}

// ==============================================================================
// 4. Spelling Correction Module (Step 6)
// ==============================================================================

/**
 * Sends entered text to Flask backend for analysis and updates the UI
 */
async function checkSpelling() {
  const text = DOM.textInput.value.trim();

  // Validate empty input
  if (!text) {
    DOM.textInput.focus();
    showResultBadge("error", "⚠️ Please type a word first!");
    setMascotMessage("Hoo-hoo! Please enter a word before asking me to check! 🦉");
    return;
  }

  // Visual feedback: Show checking state
  DOM.checkSpellingBtn.disabled = true;
  DOM.checkSpellingBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Checking...</span>';

  try {
    const response = await fetch('/api/check-spelling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      const data = result.data;
      AppState.currentWord = data.original;
      AppState.correctedWord = data.corrected;
      AppState.isCorrect = data.is_correct;

      // Render the result comparison card
      renderSpellingResult(data);

      // Update dashboard stats
      updateDashboardStats(data.is_correct);

    } else {
      showResultBadge("error", `⚠️ ${result.message || "Could not check spelling"}`);
      setMascotMessage("Oops! Something went wrong while checking. Let's try again! 🦉");
    }

  } catch (error) {
    console.error("Error communicating with spelling server:", error);
    showResultBadge("error", "⚠️ Network error. Please ensure Flask server is running.");
    setMascotMessage("Oh dear! I couldn't reach the WordWhiz server. Is it running? 🦉");
  } finally {
    DOM.checkSpellingBtn.disabled = false;
    DOM.checkSpellingBtn.innerHTML = '<span class="btn-icon">🔍</span><span class="btn-text">Check Spelling</span>';
  }
}

/**
 * Renders the spelling result card with comparative styling
 */
function renderSpellingResult(data) {
  // Reveal result card
  DOM.resultCard.classList.remove('hidden');

  // Populate text displays
  DOM.originalTextDisplay.textContent = data.original;
  DOM.correctedTextDisplay.textContent = data.corrected;
  DOM.encouragingQuote.textContent = `"${data.message}"`;

  // Enable pronunciation buttons
  DOM.listenPronounceBtn.disabled = false;
  DOM.tryAgainBtn.style.display = 'inline-flex';

  if (data.is_correct) {
    // Word was already spelled correctly
    showResultBadge("correct", "✅ Perfect Spelling!");
    setMascotMessage(`"Hoo-hoo! Awesome job! '${data.original}' is spelled perfectly! Click the speaker to hear it!" 🌟`);
    
    // Trigger victory mini confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  } else {
    // Word had spelling errors corrected
    showResultBadge("corrected", "✨ Spelling Improved!");
    setMascotMessage(`"Good try! We fixed '${data.original}' to '${data.corrected}'. Click the speaker to hear the British pronunciation!" 🦉`);
  }
}

/**
 * Updates status badge text and CSS class
 */
function showResultBadge(type, text) {
  DOM.resultCard.classList.remove('hidden');
  DOM.statusBadge.className = `result-status-badge ${type}`;
  DOM.statusBadge.textContent = text;
}

/**
 * Clears text input and resets tutor state
 */
function clearInput() {
  DOM.textInput.value = "";
  DOM.resultCard.classList.add('hidden');
  DOM.listenPronounceBtn.disabled = true;
  DOM.tryAgainBtn.style.display = 'none';
  DOM.textInput.focus();
  setMascotMessage("Ready for a new word! Type or speak whenever you like! 🦉");
}

/**
 * Try Again button handler
 */
function tryAgain() {
  DOM.textInput.select();
  DOM.textInput.focus();
}

// ==============================================================================
// 5. Dashboard Score Updates
// ==============================================================================
function updateDashboardStats(isCorrect) {
  if (isCorrect) {
    AppState.stats.correctCount += 1;
    AppState.stats.currentStreak += 1;
    AppState.stats.totalScore += 10;
  } else {
    AppState.stats.improvedCount += 1;
    AppState.stats.currentStreak = 0; // Streak resets on error
    AppState.stats.totalScore += 5; // Reward effort (+5 points for learning)
  }

  // Update UI values
  DOM.dashboardTotalScore.textContent = AppState.stats.totalScore;
  DOM.dashboardCorrectCount.textContent = AppState.stats.correctCount;
  DOM.dashboardImprovedCount.textContent = AppState.stats.improvedCount;
  DOM.dashboardStreak.textContent = AppState.stats.currentStreak;

  // Save to localStorage
  try {
    localStorage.setItem('wordwhiz_stats', JSON.stringify(AppState.stats));
  } catch (e) {
    // Silently ignore if localStorage is disabled
  }
}

function loadDashboardStats() {
  try {
    const saved = localStorage.getItem('wordwhiz_stats');
    if (saved) {
      AppState.stats = JSON.parse(saved);
      DOM.dashboardTotalScore.textContent = AppState.stats.totalScore || 0;
      DOM.dashboardCorrectCount.textContent = AppState.stats.correctCount || 0;
      DOM.dashboardImprovedCount.textContent = AppState.stats.improvedCount || 0;
      DOM.dashboardStreak.textContent = AppState.stats.currentStreak || 0;
    }
  } catch (e) {
    // Ignore error
  }
}

function resetDashboardStats() {
  if (confirm("Would you like to reset your score dashboard back to 0?")) {
    AppState.stats = { totalScore: 0, correctCount: 0, improvedCount: 0, currentStreak: 0 };
    DOM.dashboardTotalScore.textContent = "0";
    DOM.dashboardCorrectCount.textContent = "0";
    DOM.dashboardImprovedCount.textContent = "0";
    DOM.dashboardStreak.textContent = "0";
    localStorage.removeItem('wordwhiz_stats');
    setMascotMessage("Scoreboard has been refreshed! Let's start a fresh learning adventure! 🦉🌟");
  }
}

// ==============================================================================
// 7. Voice Recognition Module (Step 7 - Web Speech API)
// ==============================================================================

/**
 * Initializes browser Web Speech Recognition with en-GB preference
 */
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("Web Speech API not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-GB'; // British English preferred
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    AppState.isRecording = true;
    DOM.voiceBtn.classList.add('recording');
    DOM.voiceBtnText.textContent = "Listening...";
    DOM.voiceStatusBanner.classList.remove('hidden');
    DOM.voiceStatusText.textContent = "🎙️ Listening to your voice... Speak clearly!";
    setMascotMessage("Listening to you! Speak your word or sentence clearly into your microphone! 🦉🎤");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    console.log("Speech recognized:", transcript);

    // Populate input field with transcribed words
    DOM.textInput.value = transcript;
    DOM.voiceStatusText.textContent = `Recognized: "${transcript}"! Checking spelling...`;
    setMascotMessage(`"I heard you say: '${transcript}'! Checking spelling now..." 🦉`);

    // Automatically send recognized text for spelling analysis
    setTimeout(() => {
      checkSpelling();
    }, 600);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    stopRecordingUI();

    let friendlyError = "Couldn't hear you clearly. Please try again!";
    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      friendlyError = "Microphone access blocked! Please click the lock icon 🔒 near your browser address bar to allow microphone access.";
    } else if (event.error === 'no-speech') {
      friendlyError = "No speech detected. Please speak closer to your microphone.";
    } else if (event.error === 'network') {
      friendlyError = "Network connection needed for voice recognition.";
    }

    DOM.voiceStatusBanner.classList.remove('hidden');
    DOM.voiceStatusText.textContent = `⚠️ ${friendlyError}`;
    setMascotMessage(friendlyError);
  };

  recognition.onend = () => {
    stopRecordingUI();
  };

  return recognition;
}

function stopRecordingUI() {
  AppState.isRecording = false;
  DOM.voiceBtn.classList.remove('recording');
  DOM.voiceBtnText.textContent = "Speak into Mic";
  setTimeout(() => {
    DOM.voiceStatusBanner.classList.add('hidden');
  }, 2800);
}

function toggleVoiceRecognition() {
  if (!AppState.recognition) {
    AppState.recognition = initSpeechRecognition();
  }

  if (!AppState.recognition) {
    alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge for microphone input!");
    setMascotMessage("Your browser doesn't support the magic microphone! Try opening WordWhiz in Google Chrome or Microsoft Edge! 🦉");
    return;
  }

  if (AppState.isRecording) {
    AppState.recognition.stop();
  } else {
    try {
      AppState.recognition.start();
    } catch (err) {
      console.warn("Recognition already active or restarting:", err);
      AppState.recognition.stop();
    }
  }
}

// ==============================================================================
// 8. Pronunciation Playback Module (Step 8 - SpeechSynthesis API)
// ==============================================================================

/**
 * Loads available browser voices and selects British English (en-GB)
 */
function initSpeechSynthesis() {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech Synthesis not supported in this browser.");
    if (DOM.soundStatusPill) {
      DOM.soundStatusPill.innerHTML = '<span class="dot" style="background:#ff5d8f"></span><span class="text">Speech Audio Unsupported</span>';
    }
    return;
  }

  function pickBritishVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Search for British English voices (en-GB, UK, British, etc.)
    const ukVoice = voices.find(v => 
      v.lang === 'en-GB' || 
      v.lang.toLowerCase().includes('en_gb') || 
      v.name.includes('United Kingdom') || 
      v.name.includes('UK') || 
      v.name.includes('British')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    AppState.britishVoice = ukVoice;
    console.log("Selected British English Voice:", ukVoice ? ukVoice.name : "Default");

    if (DOM.soundStatusPill && ukVoice) {
      DOM.soundStatusPill.innerHTML = `<span class="dot"></span><span class="text">British Voice 🇬🇧 (${ukVoice.name.split(' ')[0]})</span>`;
    }
  }

  // Voices may load asynchronously
  pickBritishVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = pickBritishVoice;
  }
}

/**
 * Speaks a word or sentence using the British English voice
 * @param {string} text - The word or sentence to speak
 * @param {number|null} customRate - Optional custom speech rate (e.g. 0.7 for slow playback)
 */
function speakText(text, customRate = null) {
  if (!text) return;

  if (!('speechSynthesis' in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Cancel any active speech to avoid overlapping audio
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Assign British English voice preference
  if (AppState.britishVoice) {
    utterance.voice = AppState.britishVoice;
  }
  utterance.lang = 'en-GB';

  // Determine speech rate (Kid-friendly normal rate 0.9x or custom slow 0.75x)
  let rate = 0.9;
  if (customRate !== null) {
    rate = customRate;
  } else if (DOM.speechRate && DOM.speechRate.value) {
    rate = parseFloat(DOM.speechRate.value);
  }
  utterance.rate = rate;

  // Gentle, friendly pitch
  utterance.pitch = 1.05;

  // Visual cues while speaking
  utterance.onstart = () => {
    DOM.listenPronounceBtn.classList.add('btn-glow');
    if (DOM.speakResultBtn) DOM.speakResultBtn.textContent = "🔊 Speaking...";
    setMascotMessage(`"Listening to British pronunciation of '${text}'... Listen closely!" 🎧`);
  };

  utterance.onend = () => {
    DOM.listenPronounceBtn.classList.remove('btn-glow');
    if (DOM.speakResultBtn) DOM.speakResultBtn.textContent = "🔊 Play Pronunciation";
  };

  utterance.onerror = (e) => {
    console.error("Speech synthesis error:", e);
    DOM.listenPronounceBtn.classList.remove('btn-glow');
    if (DOM.speakResultBtn) DOM.speakResultBtn.textContent = "🔊 Play Pronunciation";
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Plays the pronunciation of the current tutor word
 */
function playCurrentWordPronunciation(customRate = null) {
  const targetText = AppState.correctedWord || DOM.textInput.value.trim();
  if (!targetText) {
    setMascotMessage("Please type or check a word first before listening! 🦉");
    return;
  }
  speakText(targetText, customRate);
}

// ==============================================================================
// 9. Interactive Spelling Quiz Arena (Step 9)
// ==============================================================================

// Default fallback quiz questions in case server request takes time
const DEFAULT_QUIZ_QUESTIONS = [
  { id: 1, word: "butterfly", category: "Nature & Animals 🦋", hint: "A colorful flying insect with large, delicate wings." },
  { id: 2, word: "Wednesday", category: "Days of the Week 📅", hint: "Day of the week between Tuesday and Thursday (watch the silent 'd'!)." },
  { id: 3, word: "beautiful", category: "Descriptive Words ✨", hint: "Very pleasing to look at or charming (starts with 'b-e-a-u')." },
  { id: 4, word: "knife", category: "Silent Letters 🔪", hint: "Kitchen tool used for slicing fruit and bread (starts with a silent 'k')." },
  { id: 5, word: "chocolate", category: "Yummy Treats 🍫", hint: "A delicious sweet food made from roasted cacao beans." }
];

/**
 * Initializes or restarts the quiz
 */
async function initQuiz() {
  AppState.quiz.currentIndex = 0;
  AppState.quiz.points = 0;
  AppState.quiz.isActive = true;

  DOM.quizCurrentPoints.textContent = "0";
  DOM.quizCompleteScreen.classList.add('hidden');
  DOM.quizQuestionBody.classList.remove('hidden');

  try {
    const res = await fetch('/api/quiz-words');
    const data = await res.json();
    if (res.ok && data.status === 'success' && data.questions.length > 0) {
      AppState.quiz.questions = data.questions.slice(0, 5); // 5 questions per quiz round
    } else {
      AppState.quiz.questions = DEFAULT_QUIZ_QUESTIONS;
    }
  } catch (err) {
    console.warn("Could not fetch quiz words from backend, using defaults:", err);
    AppState.quiz.questions = DEFAULT_QUIZ_QUESTIONS;
  }

  loadQuizQuestion();
}

/**
 * Loads the current quiz question onto the arena card
 */
function loadQuizQuestion() {
  const currentQ = AppState.quiz.questions[AppState.quiz.currentIndex];
  const total = AppState.quiz.questions.length;

  // Update status indicators
  DOM.questionCounter.textContent = `Question ${AppState.quiz.currentIndex + 1} of ${total}`;
  DOM.quizCategoryBadge.textContent = currentQ.category || "Vocabulary";
  DOM.clueTitle.textContent = "Mystery Word Audio Challenge";
  DOM.clueDescription = "Click below to hear the word pronounced in British English, then spell it!";
  DOM.quizHintText.textContent = currentQ.hint;

  // Update progress bar
  const progressPercent = ((AppState.quiz.currentIndex + 1) / total) * 100;
  DOM.progressBarFill.style.width = `${progressPercent}%`;

  // Reset inputs and feedback
  DOM.quizAnswerInput.value = "";
  DOM.quizAnswerInput.disabled = false;
  DOM.quizSubmitBtn.disabled = false;
  DOM.quizFeedbackBox.classList.add('hidden');
  DOM.quizAnswerInput.focus();

  // Speak word automatically after a brief moment
  setTimeout(() => {
    speakQuizWord(0.9);
  }, 400);

  setMascotMessage(`"Quiz Question ${AppState.quiz.currentIndex + 1}! Listen closely and type the spelling! You've got this!" 🦉✨`);
}

/**
 * Pronounces the active mystery quiz word
 */
function speakQuizWord(rate = 0.9) {
  const currentQ = AppState.quiz.questions[AppState.quiz.currentIndex];
  if (currentQ && currentQ.word) {
    speakText(currentQ.word, rate);
  }
}

/**
 * Validates the user's submitted quiz answer
 */
function submitQuizAnswer() {
  const userAnswer = DOM.quizAnswerInput.value.trim().toLowerCase();
  if (!userAnswer) {
    DOM.quizAnswerInput.focus();
    alert("Please type your spelling guess before submitting! 🎯");
    return;
  }

  const currentQ = AppState.quiz.questions[AppState.quiz.currentIndex];
  const correctAnswer = currentQ.word.toLowerCase();
  const isMatch = (userAnswer === correctAnswer);

  // Disable input & submit during feedback
  DOM.quizAnswerInput.disabled = true;
  DOM.quizSubmitBtn.disabled = true;
  DOM.quizFeedbackBox.classList.remove('hidden');

  if (isMatch) {
    // Correct Answer
    AppState.quiz.points += 10;
    DOM.quizCurrentPoints.textContent = AppState.quiz.points;
    updateDashboardStats(true);

    DOM.quizFeedbackBox.className = "quiz-feedback-box correct";
    DOM.quizFeedbackIcon.textContent = "🎉";
    DOM.quizFeedbackTitle.textContent = "Great Job! You're Brilliant!";
    DOM.quizFeedbackMessage.textContent = `Spot on! '${currentQ.word}' is spelled 100% correctly!`;

    // Victory confetti burst
    if (typeof confetti === 'function') {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    setMascotMessage(`"Hoo-hoo! Super star! You got '${currentQ.word}' completely right!" 🌟🦉`);

  } else {
    // Incorrect Answer
    updateDashboardStats(false);

    DOM.quizFeedbackBox.className = "quiz-feedback-box incorrect";
    DOM.quizFeedbackIcon.textContent = "💡";
    DOM.quizFeedbackTitle.textContent = "Good Try! You're Improving!";
    DOM.quizFeedbackMessage.innerHTML = `You wrote <strong>"${DOM.quizAnswerInput.value}"</strong>. The correct spelling is <strong>"${currentQ.word}"</strong>.`;

    setMascotMessage(`"Nice effort! The correct spelling is '${currentQ.word}'. Listen to it again and remember it!" 🦉`);
  }
}

/**
 * Advances to the next question or completes the quiz
 */
function nextQuizQuestion() {
  if (AppState.quiz.currentIndex + 1 < AppState.quiz.questions.length) {
    AppState.quiz.currentIndex += 1;
    loadQuizQuestion();
  } else {
    completeQuiz();
  }
}

/**
 * Renders the quiz victory celebration screen
 */
function completeQuiz() {
  DOM.quizQuestionBody.classList.add('hidden');
  DOM.quizCompleteScreen.classList.remove('hidden');

  const maxPoints = AppState.quiz.questions.length * 10;
  DOM.finalScoreDisplay.textContent = `${AppState.quiz.points} / ${maxPoints}`;

  let encouragement = "Wonderful effort! Every quiz makes you sharper!";
  if (AppState.quiz.points === maxPoints) {
    encouragement = "🏆 PERFECT SCORE! You are a certified WordWhiz Grandmaster!";
  } else if (AppState.quiz.points >= maxPoints * 0.7) {
    encouragement = "🌟 Outstanding Performance! Your spelling skills are soaring!";
  }
  DOM.completeMessage.textContent = encouragement;

  // Grand celebratory confetti cannon!
  if (typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
  }

  setMascotMessage(`"Hoo-hoo! Quiz Complete! You scored ${AppState.quiz.points} points! Barnaby is cheering for you!" 🦉🎉`);
}

// ==============================================================================
// 6. Event Listeners Initialization (Step 6, 7, 8 & 9)
// ==============================================================================
function initEventListeners() {
  // Check Spelling Button
  DOM.checkSpellingBtn.addEventListener('click', checkSpelling);

  // Voice Input Microphone Button (Step 7)
  DOM.voiceBtn.addEventListener('click', toggleVoiceRecognition);

  // Pronunciation Audio Buttons (Step 8)
  DOM.listenPronounceBtn.addEventListener('click', () => playCurrentWordPronunciation());
  DOM.speakResultBtn.addEventListener('click', () => playCurrentWordPronunciation());

  // Interactive Quiz Buttons (Step 9)
  DOM.quizPlayAudioBtn.addEventListener('click', () => speakQuizWord(0.9));
  DOM.quizSlowAudioBtn.addEventListener('click', () => speakQuizWord(0.65));
  DOM.quizSubmitBtn.addEventListener('click', submitQuizAnswer);
  DOM.quizNextBtn.addEventListener('click', nextQuizQuestion);
  DOM.restartQuizBtn.addEventListener('click', initQuiz);

  // Enter Key on Quiz Answer Input
  DOM.quizAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (DOM.quizFeedbackBox.classList.contains('hidden')) {
        submitQuizAnswer();
      } else {
        nextQuizQuestion();
      }
    }
  });

  // Enter Key on Text Input triggers Check Spelling
  DOM.textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkSpelling();
    }
  });

  // Clear Input Button
  DOM.clearBtn.addEventListener('click', clearInput);

  // Try Again Button
  DOM.tryAgainBtn.addEventListener('click', tryAgain);

  // Reset Score Button
  DOM.resetScoreBtn.addEventListener('click', resetDashboardStats);

  // Smooth Navigation Spy for Active Link Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  });

  // Mascot Click easter egg
  DOM.owlMascot.addEventListener('click', () => {
    const funPhrases = [
      "Hoo-hoo! Barnaby is here to help you spell!",
      "Did you know? English has over 170,000 words!",
      "You have an amazing brain! Keep practicing!",
      "Spelling is like a secret code waiting to be cracked! 🔍"
    ];
    const phrase = funPhrases[Math.floor(Math.random() * funPhrases.length)];
    setMascotMessage(phrase);
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();
  initSpeechSynthesis();
  initQuiz();
  initEventListeners();
});
