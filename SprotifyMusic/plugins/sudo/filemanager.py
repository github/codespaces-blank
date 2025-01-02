import io
import os
import time
import shutil
from inspect import signature
from os.path import exists, isdir

from pyrogram import filters
from pyrogram.types import Message

from SprotifyMusic import app
from SprotifyMusic.misc import SUDOERS

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

    # Get valid arguments for the function
    valid_args = signature(func).parameters.keys()
    filtered_kwargs = {k: v for k, v in kwargs.items() if k in valid_args}

    return await func(**filtered_kwargs)


def capture_err(func):
    """Decorator to handle errors gracefully."""
    async def wrapper(client, message, *args, **kwargs):
        try:
            return await func(client, message, *args, **kwargs)
        except Exception as e:
            error_feedback = split_limits(str(e))
            for feedback in error_feedback:
                await message.reply(feedback)
            raise e
    return wrapper


@app.on_message(filters.command("ls") & ~filters.forwarded & ~filters.via_bot & SUDOERS)
@capture_err
async def lst(_, message):
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
        msg = f"Folders and Files in `{path}`:\n\n" if directory else "Folders and Files in Current Directory:\n\n"
        files = ""
        folders = ""

        for contents in sorted(os.listdir(path)):
            item_path = os.path.join(path, contents)
            if isdir(item_path):
                folders += f"📁 {contents}\n"
            else:
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

        msg += folders + files if files or folders else "__empty path__"
    else:
        size = os.stat(path).st_size
        last_modified = time.ctime(os.path.getmtime(path))
        last_accessed = time.ctime(os.path.getatime(path))

        if path.endswith((".mp3", ".flac", ".wav", ".m4a")):
            mode = "🎵"
        elif path.endswith(".opus"):
            mode = "🎙"
        elif path.endswith((".mkv", ".mp4", ".webm", ".avi", ".mov", ".flv")):
            mode = "🎞"
        elif path.endswith((".zip", ".tar", ".tar.gz", ".rar", ".7z", ".xz")):
            mode = "🗜"
        elif path.endswith((".jpg", ".jpeg", ".png", ".gif", ".bmp", ".ico", ".webp")):
            mode = "🖼"
        elif path.endswith((".exe", ".deb")):
            mode = "⚙️"
        elif path.endswith((".iso", ".img")):
            mode = "💿"
        elif path.endswith((".apk", ".xapk")):
            mode = "📱"
        elif path.endswith(".py"):
            mode = "🐍"
        else:
            mode = "📄"

        msg = (
            f"<b>Location:</b> {path}\n"
            f"<b>Icon:</b> {mode}\n"
            f"<b>Size:</b> {humanbytes(size)}\n"
            f"<b>Last Modified:</b> {last_modified}\n"
            f"<b>Last Accessed:</b> {last_accessed}\n"
        )

    if len(msg) > MAX_MESSAGE_SIZE_LIMIT:
        with io.BytesIO(str.encode(msg)) as out_file:
            out_file.name = "ls.txt"
            await app.send_document(message.chat.id, out_file, caption=path)
            await message.delete()
    else:
        await eor(message, text=msg)


@app.on_message(filters.command("rm") & ~filters.forwarded & ~filters.via_bot & SUDOERS)
@capture_err
async def rm_file(_, message):
    if len(message.command) < 2:
        return await eor(message, text="Please provide a file name or directory to delete.")
    file = message.text.split(" ", 1)[1]

    if exists(file):
        if isdir(file):
            try:
                shutil.rmtree(file)  # Removes a directory and its contents
                await eor(message, text=f"Directory `{file}` has been deleted.")
            except Exception as e:
                await eor(message, text=f"Failed to delete directory `{file}`: {str(e)}")
        else:
            try:
                os.remove(file)  # Removes a file
                await eor(message, text=f"File `{file}` has been deleted.")
            except Exception as e:
                await eor(message, text=f"Failed to delete file `{file}`: {str(e)}")
    else:
        await eor(message, text=f"{file} doesn't exist!")