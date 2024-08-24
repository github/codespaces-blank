import openai
import os
from dotenv import load_dotenv
import json 
from .getContent import getContent
 
# Load environment variables from .env
load_dotenv()

# Load OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI Client
openai.api_key = OPENAI_API_KEY

async def getTopicOutline(topic: str, context: list) -> list:
    """Generate topic outline for a podcast about the given topic."""
    
    topic_outline_prompt = f"""
    Write a topic outline for a podcast about {topic}.
    First topic is intro, last topic is outro.
    Add 3 more topics in between.
    Return the response as a JSON list. Each item should look like this {{
      "topic": "...",
      "description": "..."
    }},
    IMPORTANT! Return ONLY a JSON object. Don't add quotes or comments around it.
    """

    try:
        outline_response = await getContent(topic_outline_prompt, context)

        if not outline_response:
            raise ValueError("Failed to retrieve topic outline content.")

        # Clean and parse the response into JSON format
        response = json.loads(outline_response.strip())

        return response
    except Exception as e:
        print("Error:", e)
        raise e
