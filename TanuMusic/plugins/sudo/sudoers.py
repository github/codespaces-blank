from pyrogram import filters
from pyrogram.types import Message

from TanuMusic import app
from TanuMusic.misc import SUDOERS
from TanuMusic.utils.database import add_sudo, remove_sudo
from TanuMusic.utils.decorators.language import language
from TanuMusic.utils.extraction import extract_user
from TanuMusic.utils.inline import close_markup
from config import BANNED_USERS, OWNER_ID


@app.on_message(filters.command(["addsudo"]) & filters.user(OWNER_ID))
@language
async def useradd(client, message: Message, _):
    if not message.reply_to_message:
        if len(message.command) != 2:
            return await message.reply_text(_["general_1"])
    user = await extract_user(message)
    if user.id in SUDOERS:
        return await message.reply_text(_["sudo_1"].format(user.mention))
    added = await add_sudo(user.id)
    if added:
        SUDOERS.add(user.id)
        await message.reply_text(_["sudo_2"].format(user.mention))
    else:
        await message.reply_text(_["sudo_8"])


@app.on_message(filters.command(["delsudo", "rmsudo"]) & filters.user(OWNER_ID))
@language
async def userdel(client, message: Message, _):
    if not message.reply_to_message:
        if len(message.command) != 2:
            return await message.reply_text(_["general_1"])
    user = await extract_user(message)
    if user.id not in SUDOERS:
        return await message.reply_text(_["sudo_3"].format(user.mention))
    removed = await remove_sudo(user.id)
    if removed:
        SUDOERS.remove(user.id)
        await message.reply_text(_["sudo_4"].format(user.mention))
    else:
        await message.reply_text(_["sudo_8"])

@app.on_message(filters.command(["sudolist", "listsudo", "sudoers"]) & ~BANNED_USERS)
@language
async def sudoers_list(client, message: Message, _):
    text = _["sudo_5"]
    
    # Handle OWNER_ID as a list
    if isinstance(config.OWNER_ID, (list, tuple, set)):
        for owner_id in config.OWNER_ID:
            user = await app.get_users(owner_id)
            if isinstance(user, list):  # Handle multiple users returned
                for u in user:
                    user_text = u.mention if hasattr(u, "mention") else u.first_name
                    text += f"❖ {user_text}\n"
            else:
                user_text = user.mention if hasattr(user, "mention") else user.first_name
                text += f"❖ {user_text}\n"
    else:
        user = await app.get_users(config.OWNER_ID)
        if isinstance(user, list):
            for u in user:
                user_text = u.mention if hasattr(u, "mention") else u.first_name
                text += f"❖ {user_text}\n"
        else:
            user_text = user.mention if hasattr(user, "mention") else user.first_name
            text += f"❖ {user_text}\n"
    
    count = 0
    smex = 0

    # Loop through SUDOERS to list them
    for user_id in SUDOERS:
        if user_id not in config.OWNER_ID:  # Avoid listing owners twice
            try:
                user = await app.get_users(user_id)
                if isinstance(user, list):  # Handle multiple users
                    for u in user:
                        user_text = u.mention if hasattr(u, "mention") else u.first_name
                        if smex == 0:
                            smex += 1
                            text += _["sudo_6"]
                        count += 1
                        text += f"❖ {count} ➥ {user_text}\n"
                else:
                    user_text = user.mention if hasattr(user, "mention") else user.first_name
                    if smex == 0:
                        smex += 1
                        text += _["sudo_6"]
                    count += 1
                    text += f"❖ {count} ➥ {user_text}\n"
            except Exception as e:
                continue  # Skip if user lookup fails
    
    if count == 0:
        text += _["sudo_7"]

    # Reply with the sudoers list
    await message.reply_text(text, reply_markup=close_markup(_))