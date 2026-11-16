"""
Automated Test Suite for WordWhiz 🌙
Tests all routes, template rendering, API contracts, and edge cases.
"""

import unittest
import json
from app import app

class WordWhizTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_01_home_page_rendering(self):
        """Verify the main single-page application loads with HTTP 200"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        html = response.data.decode('utf-8')
        self.assertIn("WordWhiz", html)
        self.assertIn("Barnaby the Whiz Owl", html)
        self.assertIn("Spelling & Pronunciation Station", html)
        self.assertIn("Interactive Spelling Quiz Arena", html)
        print("PASS: Home page rendered successfully.")

    def test_02_api_status_healthcheck(self):
        """Verify the healthcheck endpoint"""
        response = self.client.get('/api/status')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get("status"), "online")
        self.assertEqual(data.get("app"), "WordWhiz 🌙")
        print("PASS: API status health check returned online.")

    def test_03_check_spelling_misspelled(self):
        """Test spelling correction with a misspelled word"""
        payload = {"text": "defanitely"}
        response = self.client.post(
            '/api/check-spelling',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result.get("status"), "success")
        data = result.get("data")
        self.assertEqual(data.get("original"), "defanitely")
        self.assertEqual(data.get("corrected"), "definitely")
        self.assertFalse(data.get("is_correct"))
        self.assertTrue(len(data.get("message")) > 0)
        print(f"PASS: Spelling correction successfully corrected 'defanitely' -> '{data.get('corrected')}'.")

    def test_04_check_spelling_already_correct(self):
        """Test spelling correction with an already correct word"""
        payload = {"text": "wonderful"}
        response = self.client.post(
            '/api/check-spelling',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result.get("status"), "success")
        data = result.get("data")
        self.assertEqual(data.get("original"), "wonderful")
        self.assertEqual(data.get("corrected"), "wonderful")
        self.assertTrue(data.get("is_correct"))
        print("PASS: Correct word 'wonderful' verified without unnecessary changes.")

    def test_05_check_spelling_validation_empty(self):
        """Test that empty or whitespace-only input returns HTTP 400"""
        payload = {"text": "   "}
        response = self.client.post(
            '/api/check-spelling',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        result = json.loads(response.data)
        self.assertEqual(result.get("status"), "error")
        print("PASS: Blank text submission correctly rejected with HTTP 400.")

    def test_06_check_spelling_sentence(self):
        """Test spelling correction on a full English sentence"""
        payload = {"text": "I can spel very well"}
        response = self.client.post(
            '/api/check-spelling',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        data = result.get("data")
        self.assertEqual(data.get("corrected"), "I can spell very well")
        print(f"PASS: Sentence correction: '{data.get('original')}' -> '{data.get('corrected')}'.")

    def test_07_quiz_words_endpoint(self):
        """Test the quiz question retrieval endpoint"""
        response = self.client.get('/api/quiz-words')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get("status"), "success")
        questions = data.get("questions")
        self.assertIsInstance(questions, list)
        self.assertGreaterEqual(len(questions), 5)
        # Verify question schema
        q1 = questions[0]
        self.assertIn("word", q1)
        self.assertIn("category", q1)
        self.assertIn("hint", q1)
        print(f"PASS: Quiz bank supplied {len(questions)} verified questions with hints.")

    def test_08_static_assets_serving(self):
        """Verify CSS, JS, and Mascot SVG assets are accessible"""
        css_res = self.client.get('/static/css/style.css')
        self.assertEqual(css_res.status_code, 200)
        self.assertIn("night-theme", css_res.data.decode('utf-8'))

        js_res = self.client.get('/static/js/script.js')
        self.assertEqual(js_res.status_code, 200)
        self.assertIn("checkSpelling", js_res.data.decode('utf-8'))

        img_res = self.client.get('/static/images/owl.svg')
        self.assertEqual(img_res.status_code, 200)
        print("PASS: Static CSS, JavaScript, and SVG mascot assets serve properly.")

if __name__ == '__main__':
    unittest.main()
