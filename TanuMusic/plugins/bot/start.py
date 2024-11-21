import time
import random
from pyrogram import filters
from pyrogram.enums import ChatType
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message
from youtubesearchpython.__future__ import VideosSearch

import config
from TanuMusic import app
from TanuMusic.misc import _boot_
from TanuMusic.plugins.sudo.sudoers import sudoers_list
from TanuMusic.utils.database import (
    add_served_chat,
    add_served_user,
    blacklisted_chats,
    get_lang,
    is_banned_user,
    is_on_off,
)
from TanuMusic.utils.decorators.language import LanguageStart
from TanuMusic.utils.formatters import get_readable_time
from TanuMusic.utils.inline import help_pannel, private_panel, start_panel
from config import BANNED_USERS
from strings import get_string

IMAGE = [
    # List of image URLs (same as provided)
    "https://graph.org/file/f76fd86d1936d45a63c64.jpg",
    # Add more image URLs here...
]

# Utility function to safely resolve peer
async def safe_resolve_peer(client, user_id):
    try:
        if not isinstance(user_id, (int, str)):
            raise ValueError(f"Unsupported type for user_id: {type(user_id)} | user_id: {user_id}")
        return await client.resolve_peer(user_id)
    except Exception as e:
        print(f"Error resolving peer: {e} | user_id: {user_id}")
        return None


@app.on_message(filters.command(["start"]) & filters.private & ~BANNED_USERS)
@LanguageStart
async def start_pm(client, message: Message, _):
    user_id = message.from_user.id
    try:
        # Debug: Validate user_id
        if not isinstance(user_id, int):
            raise ValueError(f"Invalid user_id type: {type(user_id)} | user_id: {user_id}")

        await add_served_user(user_id)
        if len(message.text.split()) > 1:
            name = message.text.split(None, 1)[1]
            if name[0:4] == "help":
                keyboard = help_pannel(_)
                return await message.reply_photo(
                    random.choice(IMAGE),
                    caption=_["help_1"].format(config.SUPPORT_CHAT),
                    reply_markup=keyboard,
                )
            if name[0:3] == "sud":
                await sudoers_list(client=client, message=message, _=_)
                return
            if name[0:3] == "inf":
                query = f"https://www.youtube.com/watch?v={name.replace('info_', '', 1)}"
                results = VideosSearch(query, limit=1)
                for result in (await results.next())["result"]:
                    title = result["title"]
                    duration = result["duration"]
                    views = result["viewCount"]["short"]
                    thumbnail = result["thumbnails"][0]["url"].split("?")[0]
                    channel = result["channel"]["name"]
                    link = result["link"]
                    searched_text = _["start_6"].format(
                        title, duration, views, channel, link, app.mention
                    )
                    key = InlineKeyboardMarkup(
                        [[InlineKeyboardButton(text=_["S_B_8"], url=link)]]
                    )
                    return await app.send_photo(
                        chat_id=message.chat.id,
                        photo=thumbnail,
                        caption=searched_text,
                        reply_markup=key,
                    )
        else:
            out = private_panel(_)
            return await message.reply_photo(
                random.choice(IMAGE),
                caption=_["start_2"].format(message.from_user.mention, app.mention),
                reply_markup=InlineKeyboardMarkup(out),
            )
    except Exception as e:
        print(f"Error in start_pm: {e}")
        await message.reply_text("An unexpected error occurred.")


@app.on_message(filters.command(["start"]) & filters.group & ~BANNED_USERS)
@LanguageStart
async def start_gp(client, message: Message, _):
    try:
        out = start_panel(_)
        uptime = int(time.time() - _boot_)
        await message.reply_photo(
            random.choice(IMAGE),
            caption=_["start_1"].format(app.mention, get_readable_time(uptime)),
            reply_markup=InlineKeyboardMarkup(out),
        )
        await add_served_chat(message.chat.id)
    except Exception as e:
        print(f"Error in start_gp: {e}")


@app.on_message(filters.new_chat_members, group=-1)
async def welcome(client, message: Message):
    for member in message.new_chat_members:
        try:
            language = await get_lang(message.chat.id)
            _ = get_string(language)
            if await is_banned_user(member.id):
                try:
                    await message.chat.ban_member(member.id)
                except Exception as e:
                    print(f"Failed to ban user: {e}")
            if member.id == app.id:
                if message.chat.type != ChatType.SUPERGROUP:
                    await message.reply_text(_["start_4"])
                    return await app.leave_chat(message.chat.id)
                if message.chat.id in await blacklisted_chats():
                    await message.reply_text(
                        _["start_5"].format(
                            app.mention,
                            f"https://t.me/{app.username}?start=sudolist",
                            config.SUPPORT_CHAT,
                        ),
                        disable_web_page_preview=True,
                    )
                    return await app.leave_chat(message.chat.id)

                out = start_panel(_)
                await message.reply_photo(
                    random.choice(IMAGE),
                    caption=_["start_3"].format(
                        message.from_user.first_name,
                        app.mention,
                        message.chat.title,
                        app.mention,
                    ),
                    reply_markup=InlineKeyboardMarkup(out),
                )
                await add_served_chat(message.chat.id)
        except Exception as e:
            print(f"Error in welcome: {e}")