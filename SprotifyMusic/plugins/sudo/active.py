from pyrogram import Client, filters
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message
from unidecode import unidecode

from SprotifyMusic import app
from SprotifyMusic.misc import SUDOERS
from SprotifyMusic.utils.database import (
    get_active_chats,
    get_active_video_chats,
    remove_active_chat,
    remove_active_video_chat,
)


async def generate_join_link(chat_id: int):
    try:
        invite_link = await app.export_chat_invite_link(chat_id)
        return invite_link
    except Exception as e:
        print(f"Error generating join link for chat {chat_id}: {e}")
        return None


def ordinal(n):
    suffix = ["th", "st", "nd", "rd", "th"][min(n % 10, 4)]
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    return str(n) + suffix


@app.on_message(filters.command(["activevc", "activevoice"]) & SUDOERS)
async def activevc(_, message: Message):
    mystic = await message.reply_text("» ɢᴇᴛᴛɪɴɢ ᴀᴄᴛɪᴠᴇ ᴠᴏɪᴄᴇ ᴄʜᴀᴛs ʟɪsᴛ...")
    served_chats = await get_active_chats()
    text = ""
    j = 0
    buttons = []
    for x in served_chats:
        try:
            chat_info = await app.get_chat(x)
            title = chat_info.title or "Unknown"
            invite_link = await generate_join_link(x)
            if not invite_link:
                await remove_active_chat(x)
                continue
        except Exception as e:
            print(f"Error processing chat {x}: {e}")
            await remove_active_chat(x)
            continue

        if chat_info.username:
            user = chat_info.username
            text += f"<b>{j + 1}.</b> <a href=https://t.me/{user}>{unidecode(title).upper()}</a> [<code>{x}</code>]\n"
        else:
            text += f"<b>{j + 1}.</b> {unidecode(title).upper()} [<code>{x}</code>]\n"
        
        button_text = f"{ordinal(j + 1)} ɢʀᴏᴜᴘ "
        buttons.append([InlineKeyboardButton(button_text, url=invite_link)])
        j += 1

    if not text:
        await mystic.edit_text("» ɴᴏ ᴀᴄᴛɪᴠᴇ ᴠᴏɪᴄᴇ ᴄʜᴀᴛs ғᴏᴜɴᴅ.")
    else:
        await mystic.edit_text(
            f"<b>» ʟɪsᴛ ᴏғ ᴄᴜʀʀᴇɴᴛʟʏ ᴀᴄᴛɪᴠᴇ ᴠᴏɪᴄᴇ ᴄʜᴀᴛs :</b>\n\n{text}",
            reply_markup=InlineKeyboardMarkup(buttons),
            disable_web_page_preview=True,
        )


@app.on_message(filters.command(["activevd", "activevideo"]) & SUDOERS)
async def activevi_(_, message: Message):
    mystic = await message.reply_text("» ɢᴇᴛᴛɪɴɢ ᴀᴄᴛɪᴠᴇ ᴠɪᴅᴇᴏ ᴄʜᴀᴛs ʟɪsᴛ...")
    served_chats = await get_active_video_chats()
    text = ""
    j = 0
    buttons = []
    for x in served_chats:
        try:
            chat_info = await app.get_chat(x)
            title = chat_info.title or "Unknown"
            invite_link = await generate_join_link(x)
            if not invite_link:
                await remove_active_video_chat(x)
                continue
        except Exception as e:
            print(f"Error processing chat {x}: {e}")
            await remove_active_video_chat(x)
            continue

        if chat_info.username:
            user = chat_info.username
            text += f"<b>{j + 1}.</b> <a href=https://t.me/{user}>{unidecode(title).upper()}</a> [<code>{x}</code>]\n"
        else:
            text += f"<b>{j + 1}.</b> {unidecode(title).upper()} [<code>{x}</code>]\n"
        
        button_text = f"{ordinal(j + 1)} ɢʀᴏᴜᴘ "
        buttons.append([InlineKeyboardButton(button_text, url=invite_link)])
        j += 1

    if not text:
        await mystic.edit_text("» ɴᴏ ᴀᴄᴛɪᴠᴇ ᴠɪᴅᴇᴏ ᴄʜᴀᴛs ғᴏᴜɴᴅ.")
    else:
        await mystic.edit_text(
            f"<b>» ʟɪsᴛ ᴏғ ᴄᴜʀʀᴇɴᴛʟʏ ᴀᴄᴛɪᴠᴇ ᴠɪᴅᴇᴏ ᴄʜᴀᴛs :</b>\n\n{text}",
            reply_markup=InlineKeyboardMarkup(buttons),
            disable_web_page_preview=True,
        )


@app.on_message(filters.command("active") & SUDOERS)
async def start(client: Client, message: Message):
    ac_audio = str(len(await get_active_chats()))
    ac_video = str(len(await get_active_video_chats()))
    await message.reply_text(
        f"❖ <b>ᴀᴄᴛɪᴠᴇ ᴄʜᴀᴛs ɪɴғᴏ</b> :\n\nᴠᴏɪᴄᴇ : {ac_audio}\nᴠɪᴅᴇᴏ : {ac_video}",
        reply_markup=InlineKeyboardMarkup(
            [[InlineKeyboardButton("ᴄʟᴏsᴇ", callback_data="close")]]
        ),
    )