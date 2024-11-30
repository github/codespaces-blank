from pyrogram import Client, filters
import requests
from bs4 import BeautifulSoup
from TanuMusic import app

# Function to perform Google search
def google_search(query, max_results=5):
    """Fetches the top search results from Google."""
    url = f"https://www.google.com/search?q={query}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        )
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Parse the response with BeautifulSoup
        soup = BeautifulSoup(response.content, "html.parser")
        links = soup.find_all("a")

        # Extract links
        results = []
        for link in links:
            href = link.get("href")
            if href and href.startswith("/url?q="):
                results.append(href[7:].split("&")[0])
                if len(results) >= max_results:
                    break

        return results or ["No results found."]
    except requests.exceptions.RequestException as e:
        return [f"Error fetching results: {e}"]

# Command handler for "/search"
@app.on_message(filters.command("search"))
def search_handler(client, message):
    """Handles the /search command."""
    # Check if query is provided
    if len(message.command) > 1:
        query = " ".join(message.command[1:])
        results = google_search(query)

        # Format the results for the user
        response = f"Search Results for: {query}\n\n"
        response += "\n".join([f"{i+1}. {url}" for i, url in enumerate(results)])
        message.reply_text(response, disable_web_page_preview=True)
    else:
        message.reply_text(
            "Please provide a search query.\n\nUsage: /search <query>",
            parse_mode="Markdown",
        )