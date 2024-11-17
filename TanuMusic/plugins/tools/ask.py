from pyrogram import Client, filters
from pyrogram.types import Message
from pyrogram.enums import ChatAction
import requests
import urllib.parse
import asyncio
from TanuMusic import app

# Function to process the query
def ask_query(query, model=None):
    default_model = 'mistralai/Mixtral-8x7B-Instruct-v0.1'
    system_prompt = """You are Tanu from One Piece Ai, a Telegram bot owned by  𝐓ʜᴇ 𝐂ᴀᴘᴛᴀɪɴ's </> (@itzAsuraa). You have a love personality, respond with emojis, and act as a Telegram bot. You love Indian people💖, and your favorite AI is @ResponseByAi_Bot . respond accurately, concisely, and professionally. """

    model = model or default_model

    if model == default_model:
        query = f"{system_prompt}\n\nUser: {query}"

    encoded_query = urllib.parse.quote(query)
    url = f"https://darkness.ashlynn.workers.dev/chat/?prompt={encoded_query}&model={model}"

    response = requests.get(url)

    if response.status_code == 200:
        return response.json().get("response", "😕 Sorry, no response found.")
    else:
        return f"⚠️ Error fetching response from API. Status code: {response.status_code}"

# Command handler for the ask command
@app.on_message(filters.command("ask"))
async def ask_handler(client: Client, message: Message):
    query = message.text.split(" ", 1)  # Split the command to get the query
    if len(query) > 1:
        user_query = query[1]  # Get the actual question part

        # Send typing action to simulate a response delay
        await send_typing_action(client, message.chat.id)

        # Call the ask_query function to process the user query
        reply = ask_query(user_query)  
        user_mention = message.from_user.mention
        await message.reply_text(f"{user_mention}, {reply}🚀")
    else:
        await message.reply_text("📝 Please provide a query to ask Tanu.")


# Simulate Typing Action
async def send_typing_action(client, chat_id, duration=1):
    """
    Simulate typing action.
    """
    await client.send_chat_action(chat_id, ChatAction.TYPING)  # Use ChatAction enum
    await asyncio.sleep(duration)  # Wait for the specified duration
