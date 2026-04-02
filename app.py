import os
import re
import json as js
from flask_cors import CORS
import requests
from flask import Flask, request, jsonify, render_template
from PyPDF2 import PdfReader
from docx import Document


app = Flask(__name__)
CORS(app)

# 🔑 Move API key to environment variable (IMPORTANT for deployment)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


def extract_text(file):
    filename = file.filename.lower()
    text = ""
    if filename.endswith(".pdf"):
        reader = PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    elif filename.endswith(".docx"):
        doc = Document(file)
        text = "\n".join(p.text for p in doc.paragraphs)
    return text.strip()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/upload_resume", methods=["POST"])
def upload_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # ✅ File validation (prevents crashes)
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        return jsonify({"error": "Only PDF or DOCX allowed"}), 400

    resume_text = extract_text(file)
    if not resume_text:
        return jsonify({"error": "Failed to extract text"}), 500

    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    prompt = f"""
Extract the following information from this resume:

--- Personal Information ---
1. Full Name
2. Current Designation / Job Title
3. Years of Experience
4. First Forte / Strength
5. Second Forte / Strength
6. Brief Paragraph Candidate Description To Show Client / Profile Summary 7 Lines

--- Project 1 Details ---
7. Project 1 Title
8. Project 1 Description That What Candidate Do With under it Technologies: with line break
9. Project 1 Responsibilities (up to 5 items)

--- Project 2 Details ---
10. Project 2 Title
11. Project 2 Description That What Candidate Do With under it Technologies: with line break
12. Project 2 Responsibilities (up to 5 items)

--- Project 3 Details ---
13. Project 3 Title
14. Project 3 Description That What Candidate Do With under it Technologies: with line break
15. Project 3 Responsibilities (up to 5 items)

--- Technical Skills ---
16. Programming Languages
17. Database
18. Technologies
19. Report & Analytics
20. Miscellaneous

--- Education ---
21. Degree Name
22. College Name

--- Certifications ---
23. List up to 10 certifications

Provide the answer in JSON format exactly like this:
{{
    "name": "",
    "designation": "",
    "years": "",
    "forte1": "",
    "forte2": "",
    "description": "",
    "p1_title": "",
    "p1_desc": "",
    "p1_resp": ["", "", "", "", ""],
    "p2_title": "",
    "p2_desc": "",
    "p2_resp": ["", "", "", "", ""],
    "p3_title": "",
    "p3_desc": "",
    "p3_resp": ["", "", "", "", ""],
    "prog": "",
    "db": "",
    "tech": "",
    "report": "",
    "misc": "",
    "degree": "",
    "college": "",
    "cert1": "",
    "cert2": "",
    "cert3": "",
    "cert4": "",
    "cert5": "",
    "cert6": "",
    "cert7": "",
    "cert8": "",
    "cert9": "",
    "cert10": ""
}}

Resume Content:
{resume_text}
"""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        res = requests.post(GEMINI_API_URL, json=payload, headers=headers, timeout=30)
        res.raise_for_status()
        data = res.json()
        candidates = data.get("candidates", [])

        if candidates:
            text_output = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()

            clean_text = re.sub(r"```(?:json)?\n?|```", "", text_output).strip()

            try:
                result = js.loads(clean_text)
            except Exception:
                print("JSON parse failed. Raw:", text_output)
                result = {}
        else:
            result = {}

    except Exception as e:
        print("Gemini API error:", str(e))
        result = {}

    # ✅ Ensure structure always exists (important for frontend stability)
    default_keys = [
        "name","designation","years","forte1","forte2","description",
        "p1_title","p1_desc","p1_resp","p2_title","p2_desc","p2_resp",
        "p3_title","p3_desc","p3_resp","prog","db","tech","report","misc",
        "degree","college",
        "cert1","cert2","cert3","cert4","cert5","cert6","cert7","cert8","cert9","cert10"
    ]

    for key in default_keys:
        if key not in result:
            result[key] = [""]*5 if "resp" in key else ""

    print("Extracted fields:", result)
    return jsonify(result)


if __name__ == "__main__":
    # ✅ REQUIRED for Render (dynamic port)
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
