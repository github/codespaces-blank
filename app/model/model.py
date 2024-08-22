from pydantic import BaseModel

# Define the request model
class PodcastRequest(BaseModel):
    topic: str

# Define the response model
class PodcastResponse(BaseModel):
    script: str
    url: str