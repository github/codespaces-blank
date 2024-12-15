import os
import shutil
from re import findall
from bing_image_downloader import downloader
from pyrogram import Client, filters
from pyrogram.types import InputMediaPhoto, Message
from TanuMusic import app

@app.on_message(filters.command("img", "image"))
async def google_img_search(client: Client, message: Message):
    chat_id = message.chat.id

    try:
        query = message.text.split(None, 1)[1]
    except IndexError:
        return await message.reply("❍ ᴘʀᴏᴠɪᴅᴇ ᴀɴ ɪᴍᴀɢᴇ ǫᴜɪɴ ᴛᴏ sᴇᴀʀᴄʜ!")

    lim = findall(r"lim=\d+", query)
    try:
        lim = int(lim[0].replace("lim=", ""))
        query = query.replace(f"lim={lim}", "")
    except IndexError:
        lim = 6  # Default limit to 6 images

    download_dir = "downloads"

    try:
        # Download images
        downloader.download(query, limit=lim, output_dir=download_dir, adult_filter_off=True, force_replace=False, timeout=60)
        images_dir = os.path.join(download_dir, query)
        
        # Ensure there are images to send
        if not os.listdir(images_dir):
            raise Exception("No images were downloaded.")
        
        # Get only the number of images as specified by lim
        lst = [os.path.join(images_dir, img) for img in os.listdir(images_dir)][:lim]
        
    except Exception as e:
        return await message.reply(f"❍ ᴇʀʀᴏʀ ɪɴ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ɪᴍᴀɢᴇs: {e}")

    msg = await message.reply("❍ ғɪɴᴅɪɴɢ ɪᴍᴀɢᴇs.....")

    count = 0
    for img in lst:
        count += 1
        await msg.edit(f"❍ ғɪɴᴅ {count} ɪᴍᴀɢᴇs.....")

    try:
        # Send images as a media group
        await app.send_media_group(
            chat_id=chat_id,
            media=[InputMediaPhoto(media=img) for img in lst],
            reply_to_message_id=message.id
        )

        # Cleanup the downloaded images after sending
        shutil.rmtree(images_dir)
        await msg.delete()

    except Exception as e:
        # Handle any errors while sending images
        await msg.delete()
        return await message.reply(f"❍ ᴇʀʀᴏʀ ɪɴ sᴇɴᴅɪɴɢ ɪᴍᴀɢᴇs: {e}")