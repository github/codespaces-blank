import os
import openai
from dotenv import load_dotenv
import asyncio
from .getContent import getContent

# Load environment variables from .env
load_dotenv()

#  Load environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEFAULT_PARAGRAPH_LENGTH = os.getenv("DEFAULT_PARAGRAPH_LENGTH", '500')
INTRO_OUTRO_WORD_COUNT = os.getenv("INTRO_OUTRO_WORD_COUNT", '150')

# Initialize OpenAI Client
openai.api_key = OPENAI_API_KEY

def assemble_script_with_ssml(script_chunks: list) -> str:
    """Assemble SSML script with breaks between chunks."""
    return f"<speak>{' <break time=\"1500ms\" />'.join(script_chunks)}</speak>"

async def getPodcastScript(topic: str, chapters: list) -> list:
    """Generate podcast script for a given topic and chapters."""
    base_prompt = f"""
    Podcast topics:
    The podcast has the following chapters:
    {'\n'.join([f"{index + 1}. {chapter['topic']}" for index, chapter in enumerate(chapters)])}
    Follow this narrative!

    Formatting:
    Don't use asterisk (*) or any special characters.
    Don't add comments or staging instructions.
    Don't write "Host:" or "Guest:".

    Tone:
    Keep the script concise, conversational, informal, and engaging.
    Avoid using too many superlatives or exclamations.
    Use the following SSML tags to enhance the tone of the script in moderation to accentuate important parts:
      <prosody> tags with attributes rate and volume to control the speed and volume of the speech. Valid values for volume are: x-soft, soft, medium, loud.
      <break time="..."/> tags to add pauses where needed. Break tags should always be self-closing, with break time specified in integer numbers and units (s or ms).
      <emphasis level="..."> tags with valid levels: strong, moderate, reduced.
    """

    script_promises = []
    for index, chapter in enumerate(chapters):
        chapter_prompt = ""

        if index == 0:
            chapter_prompt = f"""
            You are writing a podcast about {topic}.

            Start with an opener:
            Welcome to AI Nexus, where your curiosity fuels our conversation. I'm your AI host, ready to dive deep into today's topic, specially chosen by you. Let's explore together!.
            <break time="300ms"/>

            Write a {INTRO_OUTRO_WORD_COUNT}-word introduction for the podcast (including the opener).

            {base_prompt}
            """
        elif index == len(chapters) - 1:
            chapter_prompt = f"""
            You are writing a podcast about {topic}.
            Write a {INTRO_OUTRO_WORD_COUNT}-word outro for the podcast.
            {base_prompt}
            """
        else:
            chapter_prompt = f"""
            You are writing a podcast about {topic}.
            Write the script for chapter {index + 1}, which should be approximately {DEFAULT_PARAGRAPH_LENGTH} words, focusing on the topic "{chapter['topic']}" and description "{chapter['description']}".

            {base_prompt}
            """
        
        script_promises.append(getContent(chapter_prompt))

    # Wait for all the script pieces to be generated
    script_chunks = await asyncio.gather(*script_promises)
    return script_chunks
