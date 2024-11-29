import io
import os
import time
from inspect import getfullargspec
from os.path import exists, isdir

from pyrogram import filters
from pyrogram.types import Message

from TanuMusic import app
from TanuMusic.misc import SUDOERS

MAX_MESSAGE_SIZE_LIMIT = 4095


def humanbytes(size):
    """Convert bytes into a human-readable format."""
    for unit in ["B", "KB", "MB", "GB", "TB", "PB"]:
        if size < 1024:
            return f"{size:.2f} {unit}"
        size /= 1024


def split_limits(text, limit=MAX_MESSAGE_SIZE_LIMIT):
    """Split text into chunks that do not exceed the given limit."""
    return [text[i: i + limit] for i in range(0, len(text), limit)]


async def eor(msg: Message, **kwargs):
    """Edit or reply to a message."""
    if msg.from_user and msg.from_user.is_self:
        func = msg.edit_text
    else:
        func = msg.reply

    # Ensure we only pass valid arguments
    spec = getfullargspec(func).args
    valid_kwargs = {k: v for k, v in kwargs.items() if k in spec}

    # Call the function with await
    return await func(**valid_kwargs)


async def capture_err(func):
    """Decorator to handle errors gracefully."""
    async def wrapper(client, message, *args, **kwargs):
        try:
            return await func(client, message, *args, **kwargs)
        except Exception as e:
            error_feedback = split_limits(str(e))
            for feedback in error_feedback:
                if isinstance(message, Message):
                    await message.reply(feedback)
            raise e
    return wrapper


@app.on_message(filters.command("ls") & ~filters.forwarded & ~filters.via_bot & SUDOERS)
@capture_err
async def lst(_, message):
    prefix = message.text.split()[0][0]
    chat_id = message.chat.id
    path = os.getcwd()
    text = message.text.split(" ", 1)
    directory = None

    if len(text) > 1:
        directory = text[1].strip()
        path = directory

    if not exists(path):
        await eor(
            message,
            text=f"There is no such directory or file with the name `{directory}`. Check again!",
        )
        return

    if isdir(path):
        if directory:
            msg = f"Folders and Files in `{path}` :\n\n"
            lists = os.listdir(path)
        else:
            msg = "Folders and Files in Current Directory:\n\n"
            lists = os.listdir(path)

        files = ""
        folders = ""
        for contents in sorted(lists):
            item_path = os.path.join(path, contents)
            if not isdir(item_path):
                size = os.stat(item_path).st_size
                if contents.endswith((".mp3", ".flac", ".wav", ".m4a")):
                    files += f"🎵 {contents}\n"
                elif contents.endswith(".opus"):
                    files += f"🎙 {contents}\n"
                elif contents.endswith((".mkv", ".mp4", ".webm", ".avi", ".mov", ".flv")):
                    files += f"🎞 {contents}\n"
                elif contents.endswith((".zip", ".tar", ".tar.gz", ".rar", ".7z", ".xz")):
                    files += f"🗜 {contents}\n"
                elif contents.endswith((".jpg", ".jpeg", ".png", ".gif", ".bmp", ".ico", ".webp")):
                    files += f"🖼 {contents}\n"
                elif contents.endswith((".exe", ".deb")):
                    files += f"⚙️ {contents}\n"
                elif contents.endswith((".iso", ".img")):
                    files += f"💿 {contents}\n"
                elif contents.endswith((".apk", ".xapk")):
                    files += f"📱 {contents}\n"
                elif contents.endswith(".py"):
                    files += f"🐍 {contents}\n"
                else:
                    files += f"📄 {contents}\n"
            else:
                folders += f"📁 {contents}\n"

        if files or folders:
            msg += folders + files
        else:
            msg += "__empty path__"
    else:
        size = os.stat(path).st_size
        msg = "The details of the given file:\n\n"
        if path.endswith((".mp3", ".flac", ".wav", ".m4a")):
            mode = "🎵 "
        elif path.endswith(".opus"):
            mode = "🎙 "
        elif path.endswith((".mkv", ".mp4", ".webm", ".avi", ".mov", ".flv")):
            mode = "🎞 "
        elif path.endswith((".zip", ".tar", ".tar.gz", ".rar", ".7z", ".xz")):
            mode = "🗜 "
        elif path.endswith((".jpg", ".jpeg", ".png", ".gif", ".bmp", ".ico", ".webp")):
            mode = "🖼 "
        elif path.endswith((".exe", ".deb")):
            mode = "⚙️ "
        elif path.endswith((".iso", ".img")):
            mode = "💿 "
        elif path.endswith((".apk", ".xapk")):
            mode = "📱 "
        elif path.endswith(".py"):
            mode = "🐍 "
        else:
            mode = "📄 "

        last_modified = time.ctime(os.path.getmtime(path))
        last_accessed = time.ctime(os.path.getatime(path))
        msg += f"<b>Location:</b> {path}\n"
        msg += f"<b>Icon:</b> {mode}\n"
        msg += f"<b>Size:</b> {humanbytes(size)}\n"
        msg += f"<b>Last Modified Time:</b> {last_modified}\n"
        msg += f"<b>Last Accessed Time:</b> {last_accessed}"

    if len(msg) > MAX_MESSAGE_SIZE_LIMIT:
        with io.BytesIO(str.encode(msg)) as out_file:
            out_file.name = "ls.txt"
            await app.send_document(chat_id, out_file, caption=path)
            await message.delete()
    else:
        await eor(message, text=msg)


@app.on_message(filters.command("rm") & ~filters.forwarded & ~filters.via_bot & SUDOERS)
@capture_err
async def rm_file(client, message):
    if len(message.command) < 2:
        return await eor(message, text="Please provide a file name to delete.")
    file = message.text.split(" ", 1)[1]
    if exists(file):
        os.remove(file)
        await eor(message, text=f"{file} has been deleted.")
    else:
        await eor(message, text=f"{file} doesn't exist!")