# type: ignore
import os
import time
from google.cloud import texttospeech_v1 as texttospeech
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
BUCKET_NAME = os.getenv("BUCKET_NAME")
GOOGLE_CLIENT_EMAIL = os.getenv("GOOGLE_CLIENT_EMAIL")
GOOGLE_PRIVATE_KEY = os.getenv("GOOGLE_PRIVATE_KEY").replace('\\n', '\n')
GOOGLE_PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID")


# Initialize the TTS client
client = texttospeech.TextToSpeechLongAudioSynthesizeClient()

async def generateAudioFromText(ssml_text, topic) -> str:

    STORAGE_PATH = f"gs://{BUCKET_NAME}/podcasts/"
    file_name = topic.replace(" ", "-").lower()
    google_cloud_uri = f"{STORAGE_PATH}{file_name}"
    public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/podcasts/{file_name}"

    synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name="en-US-Neural2-F"
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,
        effects_profile_id=["small-bluetooth-speaker-class-device"],
        pitch=0,
        speaking_rate=1
    )
    
    # Create request
    request = texttospeech.SynthesizeLongAudioRequest(
        parent=f"projects/{GOOGLE_PROJECT_ID}/locations/global",
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config,
        output_gcs_uri=google_cloud_uri
    )

    try:
        operation = client.synthesize_long_audio(request=request)

        if operation.cancelled():
            raise Exception("Failed to start audio synthesis operation.")

        attempt_count = 0
        max_attempts = 100
        check_interval = 1.5  # seconds

        while attempt_count < max_attempts:
            attempt_count += 1

            if operation.done():
                return public_url  # Successful synthesis

            time.sleep(check_interval)

        raise Exception("Audio generation timed out after multiple attempts.")
    except Exception as error:
        print("Error generating audio:", error)