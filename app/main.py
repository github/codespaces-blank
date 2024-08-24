from fastapi import FastAPI, HTTPException, Request, Depends 
from typing import Any
import re

# Import the functions from the lib folder
from helpers.fetchContext import fetchContext
from helpers.getTopicOutline import getTopicOutline
from helpers.getPodcastScript import getPodcastScript
from helpers.getAudio import generateAudioFromText
from helpers.getContent import assembleScriptWithSSML
from model.model import PodcastRequest, PodcastResponse

app = FastAPI()

# Define the FastAPI route
@app.post("/podcast", response_model=PodcastResponse)
async def generate_podcast(request: PodcastRequest):

    # Clean up the topic input
    topic = re.sub(r'[^a-zA-Z0-9 ]', '', request.topic).strip()
    topic = re.sub(r'\s+', ' ', topic)

    context =  fetchContext(topic)

    # Generate topics outline and script
    topics = await getTopicOutline(topic, context)
    script = await getPodcastScript(topic, topics)

    try:
        # Generate audio and get the URL 
        url = await generateAudioFromText(assembleScriptWithSSML(script), topic)

        return PodcastResponse(url=url, script=f"{script}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate podcast audio.") from e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)