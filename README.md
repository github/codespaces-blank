
# Podwave - Backend

[![](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=darkgreen)](https://www.python.org)  [![](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com) [![](https://img.shields.io/badge/ChatGPT-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com) [![](https://img.shields.io/badge/Google%20Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com)


Podwave is an AI-driven podcast generation API built with FastAPI. It enables users to generate podcast scripts and audio for various topics, utilizing OpenAI for text generation and Google Cloud Text-to-Speech for audio synthesis.

## Features
- **AI-Generated Scripts**: Creates engaging podcast scripts based on specified topics.
- **Text-to-Speech Conversion**: Uses Google Cloud Text-to-Speech for natural-sounding audio.
- **Flexible Topics and Chapters**: Allows users to input custom topics and breaks down content into chapters.
- **SSML Support**: Incorporates SSML for more expressive audio with pauses, emphasis, and customized tone.

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/podwave.git
cd podwave
```

### 2. Set Up a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a .env file in the root directory and add the following environment variables:

```dotenv
URL = ""
DEFAULT_PARAGRAPH_LENGTH = 500
INTRO_OUTRO_WORD_COUNT = 150
WIKI_USER_AGENT = "CoolBot/0.0 (https://example.org/coolbot/; coolbot@example.org)"
OPENAI_API_KEY = "open_api_key"
MAX_POADCAST_LIMIT_PER_DAY = 5
KV_URL= ""
KV_REST_API_URL=""
KV_REST_API_TOKEN=""
KV_REST_API_READ_ONLY_TOKEN=""
BUCKET_NAME = ""
GOOGLE_PROJECT_ID = ""
GOOGLE_CLIENT_EMAIL = ""
GOOGLE_APPLICATION_CREDENTIALS=""
GOOGLE_PRIVATE_KEY = "your-key"
```
Note: Replace /path/to/your-service-account-file.json with the actual path to your Google Cloud service account credentials file.

### 5. Update Requirements
- To update requirements.txt with any new dependencies, run:

```bash
pip freeze > requirements.txt
```
- Running the Application
To start the FastAPI server, run:

```bash
uvicorn app.main:app --reload
```
Access the application at http://127.0.0.1:8000.

## API Endpoints
### Generate podcast
POST /podcast

Request: JSON payload with topic
Response: URL to the generated audio file.
Example Usage

```json
// POST /podcast
{
  "topic": "Artificial Intelligence"
}
```

## Contributing
Fork the repository
- Create a new branch (git checkout -b feature-branch)
- Commit your changes (git commit -m "Add feature")
- Push to the branch (git push origin feature-branch)
- Open a pull request

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- FastAPI for the backend framework
- OpenAI for text generation
- Google Cloud Text-to-Speech for audio synthesis