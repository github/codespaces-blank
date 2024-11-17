from pyrogram import Client, filters
from HorridAPI import Mango
from TanuMusic import app 

@app.on_message(filters.command("draw"))
def draw(client, message):
    prompt = " ".join(message.command[1:]) if len(message.command) > 1 else None
    if not prompt:
        return message.reply_text("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ǫᴜᴇʀʏ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ᴀɴ ɪᴍᴀɢᴇ ᴜsɪɴɢ /draw ᴄᴏᴍᴍᴀɴᴅs.")
    try:
        response = Mango.images.generate(model="flux-1.1-pro", prompt=prompt)
        message.reply_photo(photo=response.url, caption=" ɪᴍᴀɢᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ ʙʏ ˹ᴛᴀɴᴜ ꭙ ᴍᴜsɪᴄ™♡゙")
    except Exception as e:
        message.reply_text(f"ɢᴇᴛᴛɪɴɢ ᴇʀʀᴏʀ: {e}")