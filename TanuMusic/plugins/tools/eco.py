from pyrogram import Client, filters
from TanuMusic.misc import SUDOERS
from TanuMusic import app 

# /eco command handler
@app.on_message(filters.command("eco") & filters.reply & SUDOERS)
async def eco_reply(client, message):
    if not message.reply_to_message:
        await message.reply("ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴜsᴇʀ's ᴍᴇssᴀɢᴇ ᴛᴏ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.")
        return

    # Split the command from the message (removing the command /eco)
    command_text = message.text.lower().split("eco ", 1)

    if len(command_text) < 2:
        await message.reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴍᴇssᴀɢᴇ ᴀғᴛᴇʀ ᴛʜᴇ /eco ᴄᴏᴍᴍᴀɴᴅ.")
        return

    # The message to reply with
    reply_message = command_text[1]

    await message.delete()
    await message.reply_to_message.reply(reply_message)