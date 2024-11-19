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
    count = 0
    smex = 0

    # Ensure OWNER_ID is a single user ID or handle multiple owners
    if isinstance(config.OWNER_ID, list):
        for owner_id in config.OWNER_ID:
            user = await app.get_users(owner_id)
            user = user.first_name if not hasattr(user, "mention") else user.mention
            text += f"❖ {user}\n"
    else:
        user = await app.get_users(config.OWNER_ID)
        user = user.first_name if not hasattr(user, "mention") else user.mention
        text += f"❖ {user}\n"

    # Loop through SUDOERS and list them
    for user_id in SUDOERS:
        if user_id != config.OWNER_ID:
            try:
                user = await app.get_users(user_id)
                user = user.first_name if not hasattr(user, "mention") else user.mention
                if smex == 0:
                    smex += 1
                    text += _["sudo_6"]
                count += 1
                text += f"❖ {count} ➥ {user}\n"
            except Exception as e:
                continue  # Skip if fetching user details fails

    if count == 0:
        text += _["sudo_7"]

    # Send response
    await message.reply_text(text, reply_markup=close_markup(_))