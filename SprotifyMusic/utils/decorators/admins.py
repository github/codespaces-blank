from pyrogram.enums import ChatType
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup

from SprotifyMusic import app
from SprotifyMusic.misc import SUDOERS, db
from SprotifyMusic.utils.database import (
    get_authuser_names,
    get_cmode,
    get_lang,
    get_upvote_count,
    is_active_chat,
    is_maintenance,
    is_nonadmin_chat,
    is_skipmode,
)
from config import SUPPORT_CHAT, adminlist, confirmer
from strings import get_string

from ..formatters import int_to_alpha


def AdminRightsCheck(mystic):
    async def wrapper(client, message):
        if await is_maintenance() is False:
            if message.from_user.id not in SUDOERS:
                return await message.reply_text(
                    text=f"{app.mention} ɪs ᴜɴᴅᴇʀ ᴍᴀɪɴᴛᴇɴᴀɴᴄᴇ, ᴠɪsɪᴛ <a href={SUPPORT_CHAT}>sᴜᴘᴘᴏʀᴛ ᴄʜᴀᴛ</a> ғᴏʀ ᴋɴᴏᴡɪɴɢ ᴛʜᴇ ʀᴇᴀsᴏɴ.",
                    disable_web_page_preview=True,
                )

        try:
            await message.delete()
        except:
            pass

        try:
            language = await get_lang(message.chat.id)
            _ = get_string(language)
        except:
            _ = get_string("en")
        if message.sender_chat:
            upl = InlineKeyboardMarkup(
                [
                    [
                        InlineKeyboardButton(
                            text="ʜᴏᴡ ᴛᴏ ғɪx ?",
                            callback_data="AnonymousAdmin",
                        ),
                    ]
                ]
            )
            return await message.reply_text(_["general_3"], reply_markup=upl)
        if message.command[0][0] == "c":
            chat_id = await get_cmode(message.chat.id)
            if chat_id is None:
                return await message.reply_text(_["setting_7"])
            try:
                await app.get_chat(chat_id)
            except:
                return await message.reply_text(_["cplay_4"])
        else:
            chat_id = message.chat.id
        if not await is_active_chat(chat_id):
            return await message.reply_text(_["general_5"])
        is_non_admin = await is_nonadmin_chat(message.chat.id)
        if not is_non_admin:
            if message.from_user.id not in SUDOERS:
                admins = adminlist.get(message.chat.id)
                if not admins:
                    return await message.reply_text(_["admin_13"])
                else:
                    if message.from_user.id not in admins:
                        if await is_skipmode(message.chat.id):
                            upvote = await get_upvote_count(chat_id)
                            text = f"""<b>ᴀᴅᴍɪɴ ʀɪɢʜᴛs ɴᴇᴇᴅᴇᴅ</b>

ʀᴇғʀᴇsʜ ᴀᴅᴍɪɴ ᴄᴀᴄʜᴇ ᴠɪᴀ : /reload

» {upvote} ᴠᴏᴛᴇs ɴᴇᴇᴅᴇᴅ ғᴏʀ ᴘᴇʀғᴏʀᴍɪɴɢ ᴛʜɪs ᴀᴄᴛɪᴏɴ."""

                            command = message.command[0]
                            if command[0] == "c":
                                command = command[1:]
                            if command == "speed":
                                return await message.reply_text(_["admin_14"])
                            MODE = command.title()
                            upl = InlineKeyboardMarkup(
                                [
                                    [
                                        InlineKeyboardButton(
                                            text="ᴠᴏᴛᴇ",
                                            callback_data=f"ADMIN  UpVote|{chat_id}_{MODE}",
                                        ),
                                    ]
                                ]
                            )
                            if chat_id not in confirmer:
                                confirmer[chat_id] = {}
                            try:
                                vidid = db[chat_id][0]["vidid"]
                                file = db[chat_id][0]["file"]
                            except:
                                return await message.reply_text(_["admin_14"])
                            senn = await message.reply_text(text, reply_markup=upl)
                            confirmer[chat_id][senn.id] = {
                                "vidid": vidid,
                                "file": file,
                            }
                            return
                        else:
                            return await message.reply_text(_["admin_14"])

        return await mystic(client, message, _, chat_id)

    return wrapper


def AdminActual(mystic):
    async def wrapper(client, message):
        if await is_maintenance() is False:
            if message.from_user.id not in SUDOERS:
                return await message.reply_text(
                    text=f"{app.mention} ɪs ᴜɴᴅᴇʀ ᴍᴀɪɴᴛᴇɴᴀɴᴄᴇ, ᴠɪsɪᴛ <a href={SUPPORT_CHAT}>sᴜᴘᴘᴏʀᴛ ᴄʜᴀᴛ</a> ғᴏʀ ᴋɴᴏᴡɪɴɢ ᴛʜᴇ ʀᴇᴀsᴏɴ.",
                    disable_web_page_preview=True,
                )

        try:
            await message.delete()
        except:
            pass

        try:
            language = await get_lang(message.chat.id)
            _ = get_string(language)
        except:
            _ = get_string("en")
        if message.sender_chat:
            upl = InlineKeyboardMarkup(
                [
                    [
                        InlineKeyboardButton(
                            text="ʜᴏᴡ ᴛᴏ ғɪx ?",
                            callback_data="AnonymousAdmin",
                        ),
                    ]
                ]
            )
            return await message.reply_text(_["general_3"], reply_markup=upl)
        if message.from_user.id not in SUDOERS:
            try:
                member = (
                    await app.get_chat_member(message.chat.id, message.from_user.id)
                ).privileges
            except:
                return
            if not member.can_manage_video_chats:
                return await message.reply(_["general_4"])
        return await mystic(client, message, _)

    return wrapper


def ActualAdminCB(mystic):
    async def wrapper(client, CallbackQuery):
        if await is_maintenance() is False:
            if CallbackQuery.from_user.id not in SUDOERS:
                return await CallbackQuery.answer(
                    f"{app.mention} ɪs ᴜɴᴅᴇʀ ᴍᴀɪɴᴛᴇɴᴀɴᴄᴇ, ᴠɪsɪᴛ sᴜᴘᴘᴏʀᴛ ᴄʜᴀᴛ ғᴏʀ ᴋɴᴏᴡɪɴɢ ᴛʜᴇ ʀᴇᴀsᴏɴ.",
                    show_alert=True,
                )
        try:
            language = await get_lang(CallbackQuery.message.chat.id)
            _ = get_string(language)
        except:
            _ = get_string("en")
        if CallbackQuery.message.chat.type == ChatType.PRIVATE:
            return await mystic(client, CallbackQuery, _)
        is_non_admin = await is_nonadmin_chat(CallbackQuery.message.chat.id)
        if not is_non_admin:
            try:
                a = (
                    await app.get_chat_member(
                        CallbackQuery.message.chat.id,
                        CallbackQuery.from_user.id,
                    )
                ).privileges
            except:
                return await CallbackQuery.answer(_["general_4"], show_alert=True)
            if not a.can_manage_video_chats:
                if CallbackQuery.from_user.id not in SUDOERS:
                    token = await int_to_alpha(CallbackQuery.from_user.id)
                    _check = await get_authuser_names(CallbackQuery.from_user.id)
                    if token not in _check:
                        try:
                            return await CallbackQuery.answer(
                                _["general_4"],
                                show_alert=True,
                            )
                        except:
                            return
        return await mystic(client, CallbackQuery, _)

    return wrapper
