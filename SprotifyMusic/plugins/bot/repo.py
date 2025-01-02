from pyrogram import filters
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from SprotifyMusic import app
from config import BOT_USERNAME

start_txt = """
❖ ʜᴇʏ , ᴛʜᴇʀᴇ ɴɪᴄᴇ ᴛᴏ ᴍᴇᴇᴛ ʏᴏᴜ  ♥︎\n\n● ɪғ ʏᴏᴜ ᴡᴀɴᴛ ˹ ᴛᴀɴᴜ ꭙ ᴍᴜsɪᴄ™ ♡゙゙, ʙᴏᴛ ʀᴇᴘᴏ ᴛʜᴇɴ ᴄʟɪᴄᴋ ᴏɴ ᴛʜᴇ sᴏᴜʀᴄᴇ ᴄᴏᴅᴇ ʙᴜᴛᴛᴏɴ ᴛᴏ ᴄᴏʟʟᴇᴄᴛ ᴍʏ sᴏᴜʀᴄᴇ ᴄᴏᴅᴇ.\n\n❖ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ➥ ˹ ᴛᴀɴᴜ ꭙ ᴍᴜsɪᴄ™ ♡゙"""




@app.on_message(filters.command("repo"))
async def start(_, msg):
    buttons = [
        [
          InlineKeyboardButton("Support", url="https://t.me/SprotifyNews"),
          InlineKeyboardButton("Repo", url="https://github.com/Mister-Man7/SprotifyXMusic")
          ],
    ]
    
    reply_markup = InlineKeyboardMarkup(buttons)
    
    await msg.reply_photo(
        photo="https://envs.sh/7a2.jpg",
        caption=start_txt,
        reply_markup=reply_markup
    )
  
