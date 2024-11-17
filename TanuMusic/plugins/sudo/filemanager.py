import io
import os
import os.path
import time
from inspect import getfullargspec
from os.path import exists, isdir

from pyrogram import filters
from pyrogram.types import Message

from TanuMusic import app
from TanuMusic.misc import SUDOERS
from TanuMusic.utils.error import capture_err

MAX_MESSAGE_SIZE_LIMIT = 4095


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
            text=f"There is no such directory or file with the name `{directory}` check again!",
        )
        return
    if isdir(path):
        if directory:
            msg = "Folders and Files in `{}` :\n\n".format(path)
            lists = os.listdir(path)
        else:
            msg = "Folders and Files in Current Directory :\n\n"
            lists = os.listdir(path)
        files = ""
        folders = ""
        for contents in sorted(lists):
            thepathoflight = path + "/" + contents
            if not isdir(thepathoflight):
                size = os.stat(thepathoflight).st_size
                if contents.endswith((".mp3", ".flac", ".wav", ".m4a")):
                    files += "🎵 " + f"{contents}\n"
                if contents.endswith((".opus")):
                    files += "🎙 " + f"{contents}\n"
                elif contents.endswith(
                    (".mkv", ".mp4", ".webm", ".avi", ".mov", ".flv")
                ):
                    files += "🎞 " + f"{contents}\n"
                elif contents.endswith(
                    (".zip", ".tar", ".tar.gz", ".rar", ".7z", ".xz")
                ):
                    files += "🗜 " + f"{contents}\n"
                elif contents.endswith(
                    (".jpg", ".jpeg", ".png", ".gif", ".bmp", ".ico", ". webp")
                ):
                    files += "🖼 " + f"{contents}\n"
                elif contents.endswith((".exe", ".deb")):
                    files += "⚙️ " + f"{contents}\n"
                elif contents.endswith((".iso", ".img")):
                    files += "💿 " + f"{contents}\n"
                elif contents.endswith((".apk", ".apk")):
                    files += "📱 " + f"{contents}\n"
                elif contents.endswith((".py")):
                    files += "🐍 " + f"{contents}\n"
                else:
                    files += "📄 " + f"{contents}\n"
            else:
                folders += f"📁 {contents}\n"
        if files or folders:
            msg = msg + folders + files
        else:
            msg = msg + "__empty path__"
    else:
        size = os.stat(path).st_size
        msg = "The details of given file :\n\n"
        if path.endswith((".mp3", ".flac", ".wav", ".m4a")):
            mode = "🎵 "
        if path.endswith((".opus")):
            mode = "🎙 "
        elif path.endswith((".mkv", ".mp4", ".webm", ".avi", ".mov", ".flv")):
            mode = "🎞 "
        elif path.endswith((".zip", ".tar", ".tar.gz", ".rar", ".7z", ".xz")):
            mode = "🗜 "
        elif path.endswith((".jpg", ".jpeg", ".png", ".gif", ".bmp", ".ico", ". webp")):
            mode = "🖼 "
        elif path.endswith((".exe", ".deb")):
            mode = "⚙️ "
        elif path.endswith((".iso", ".img")):
            mode = "💿 "
        elif path.endswith((".apk", ".xapk")):
            mode = "📱 "
        elif path.endswith((".py")):
            mode = "🐍 "
        else:
            mode = "📄 "
        time.ctime(os.path.getctime(path))
        time2 = time.ctime(os.path.getmtime(path))
        time3 = time.ctime(os.path.getatime(path))
        msg += f"<b>Location : </b> {path}\n"
        msg += f"<b>Icon : </b> {mode}\n"
        msg += f"<b>Size : </b> {humanbytes(size)}\n"
        msg += f"<b>Last Modified Time: </b> {time2}\n"
        msg += f"<b>Last Accessed Time: </b> {time3}"

    if len(msg) > MAX_MESSAGE_SIZE_LIMIT:
        with io.BytesIO(str.encode(msg)) as out_file:
            out_file.name = "ls.txt"
            await app.send_document(
                chat_id,
                out_file,
                caption=path,
            )
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


async def eor(msg: Message, **kwargs):
    func = (
        (msg.edit_text if msg.from_user.is_self else msg.reply)
        if msg.from_user
        else msg.reply
    )
    spec = getfullargspec(func.__wrapped__).args
    return await func(**{k: v for k, v in kwargs.items() if k in spec})