from pyrogram import Client, filters
from HorridAPI import Mango
from TanuMusic import app

# Initialize the Mango client
mango = Mango()

@app.on_message(filters.command("draw"))
def draw(client, message):
    # Extract the prompt from the command
    prompt = " ".join(message.command[1:]) if len(message.command) > 1 else None
    if not prompt:
        return message.reply_text("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ǫᴜᴇʀʏ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ᴀɴ ɪᴍᴀɢᴇ ᴜsɪɴɢ /draw ᴄᴏᴍᴍᴀɴᴅ.")
    
    # Send a waiting message
    wait_message = message.reply_text("ɢᴇɴᴇʀᴀᴛɪɴɢ ɪᴍᴀɢᴇ, ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ... ⏳")
    
    try:
        # Generate the image using the Mango API
        response = mango.images.generate(model="flux-1.1-pro", prompt=prompt)
        wait_message.delete()  # Remove the waiting message
        # Send the generated image as a reply
        message.reply_photo(photo=response.url, caption="ɪᴍᴀɢᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ ʙʏ ˹ᴛᴀɴᴜ ꭙ ᴍᴜsɪᴄ™♡゙")
    except Exception as e:
        wait_message.delete()  # Remove the waiting message
        # Send the error message
        message.reply_text(f"ɢᴇᴛᴛɪɴɢ ᴇʀʀᴏʀ: {e}")