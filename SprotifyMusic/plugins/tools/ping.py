import time
from datetime import datetime

from pyrogram import filters
from pyrogram.types import Message
from pyrogram.enums import ParseMode

from SprotifyMusic import app
from SprotifyMusic.core.call import Sprotify 
from SprotifyMusic.utils import bot_sys_stats
from SprotifyMusic.utils.decorators.language import language
from SprotifyMusic.utils.inline import supp_markup
from config import BANNED_USERS, PING_IMG_URL


@app.on_message(filters.command(["ping", "alive"]) & ~BANNED_USERS)
@language
async def ping_com(client, message: Message, _):
    start = datetime.now()
    response = await message.reply_photo(
        photo=PING_IMG_URL,
        caption=_["ping_1"].format(app.mention),
        quote=True,
    )
    pytgping = await Sprotify.ping()
    UP, CPU, RAM, DISK = await bot_sys_stats()
    resp = (datetime.now() - start).microseconds / 1000
    await response.edit_text(
        _["ping_2"].format(resp, app.mention, UP, RAM, CPU, DISK, pytgping),
        reply_markup=supp_markup(_),
        parse_mode=ParseMode.MARKDOWN,
    )
    