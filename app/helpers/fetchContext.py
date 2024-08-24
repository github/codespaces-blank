import wikipediaapi
import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Load OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")
WIKI_USER_AGENT = os.getenv("WIKI_USER_AGENT")

def get_relevant_topics(topic: str):
    """Fetch a list of relevant Wikipedia topics from OpenAI API."""
    prompt = f"""
    Give me a list of AT MOST 3 relevant Wikipedia pages for the topic "{topic}".
    Return the response as a JSON list.
    The response should look like this:
    ["Topic A", "Topic B", "Topic C"].
    """
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        # Parse JSON response from the AI response
        relevant_topics = eval(completion.choices[0].message["content"].strip())
        return relevant_topics if isinstance(relevant_topics, list) else []
    except Exception as e:
        print("Error fetching relevant topics:", e)
        return []

def fetchContext(topic: str) -> list:
    wiki_api = wikipediaapi.Wikipedia(user_agent= WIKI_USER_AGENT,language="en")
    context = []
    processed_pages = []

    # Get relevant topics
    relevant_wiki_topics = get_relevant_topics(topic)

    for topic in relevant_wiki_topics:
        try:
            page = wiki_api.page(topic)
            if page.exists() and page.title not in processed_pages:
                processed_pages.append(page.title)
                context.append(page.text)
        except Exception as e:
            print(f"Error fetching page '{topic}':", e)

    return context
