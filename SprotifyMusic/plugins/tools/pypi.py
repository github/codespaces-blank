import requests
from pyrogram import filters
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup

from SprotifyMusic import app


def get_pypi_info(package_name):
    try:
        api_url = f"https://pypi.org/pypi/{package_name}/json"
        response = requests.get(api_url)
        if response.status_code == 200:
            pypi_info = response.json()
            return pypi_info
        else:
            return None
    except Exception as e:
        print(f"Error fetching PyPI information: {e}")
        return None


@app.on_message(filters.command("pypi", prefixes="/"))
async def pypi_info_command(client, message):
    try:
        package_name = message.command[1]
        pypi_info = get_pypi_info(package_name)

        if pypi_info:
            info_message = (
                f"❖ ᴅᴇᴀʀ {message.from_user.mention} \n "
                f"● ʜᴇʀᴇ ɪs ʏᴏᴜʀ ᴘᴀᴋᴀɢᴇ ᴅᴇᴛᴀɪʟs \n\n "
                f"● ᴘᴀᴋᴀɢᴇ ɴᴀᴍᴇ  ➥  {pypi_info['info']['name']}\n\n"
                f"● ʟᴀᴛᴇsᴛ ᴠᴇʀsɪᴏɴ  ➥  {pypi_info['info']['version']}\n\n"
                f"● ᴅᴇsᴄʀɪᴘᴛɪᴏɴ  ➥  {pypi_info['info']['summary']}\n\n"
                f"● ᴘʀᴏᴊᴇᴄᴛ ᴜʀʟ  ➥  {pypi_info['info']['project_urls']['Homepage']}"
            )
            close_markup = InlineKeyboardMarkup(
                [[InlineKeyboardButton(text="ᴄʟᴏsᴇ", callback_data="close")]]
            )
            await message.reply_text(info_message, reply_markup=close_markup)
        else:
            await message.reply_text(
                f"ᴘᴀᴄᴋᴀɢᴇ '{package_name}' ɴᴏᴛ ғᴏᴜɴᴅ \n ᴘʟᴇᴀsᴇ ᴅᴏɴᴛ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ."
            )

    except IndexError:
        await message.reply_text(
            "ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘᴀᴄᴋᴀɢᴇ ɴᴀᴍᴇ ᴀғᴛᴇʀ ᴛʜᴇ /pypi ᴄᴏᴍᴍᴀɴᴅ."
        )