import os
import requests
from bs4 import BeautifulSoup
from pyrogram import Client, filters
from pyrogram.types import InputMediaPhoto, Message
from SprotifyMusic import app

# Function to fetch images from Google Images
def fetch_google_images(query, num_images=7):
    query = '+'.join(query.split())
    url = f"https://www.google.com/search?hl=en&tbm=isch&q={query}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Will raise an HTTPError for bad responses (4xx or 5xx)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        image_urls = []

        for img_tag in soup.find_all('img', {'src': True}):
            img_url = img_tag['src']
            if img_url.startswith('http'):
                image_urls.append(img_url)

            if len(image_urls) >= num_images:
                break

        return image_urls
    except requests.exceptions.RequestException as e:
        print(f"Error fetching images: {e}")
        return []

# Function to download images
def download_images(image_urls, folder='downloads'):
    if not os.path.exists(folder):
        os.makedirs(folder)

    paths = []
    for i, url in enumerate(image_urls):
        try:
            img_data = requests.get(url).content
            img_path = os.path.join(folder, f'image_{i+1}.jpg')
            with open(img_path, 'wb') as img_file:
                img_file.write(img_data)
            paths.append(img_path)
        except Exception as e:
            print(f"Error downloading image {i+1}: {e}")
    return paths

@app.on_message(filters.command("img", "image"))
async def google_img_search(client: Client, message: Message):
    chat_id = message.chat.id

    try:
        query = message.text.split(None, 1)[1]
    except IndexError:
        return await message.reply("❍ ᴘʀᴏᴠɪᴅᴇ ᴀɴ ɪᴍᴀɢᴇ ǫᴜɪɴ ᴛᴏ sᴇᴀʀᴄʜ!")

    lim = 7  # Default limit to 7 images
    image_urls = fetch_google_images(query, num_images=lim)

    if not image_urls:
        return await message.reply("❍ ɴᴏ ɪᴍᴀɢᴇs ғᴏᴜɴᴅ!")

    msg = await message.reply("❍ ғɪɴᴅɪɴɢ ɪᴍᴀɢᴇs.....")

    # Download images
    downloaded_images = download_images(image_urls, folder="downloads")

    if not downloaded_images:
        return await message.reply("❍ ɪɴsᴜғғɪᴄɪᴇɴᴛ ɪᴍᴀɢᴇs ᴛᴏ sᴇɴᴅ.")

    try:
        # Send images as a media group
        await app.send_media_group(
            chat_id=chat_id,
            media=[InputMediaPhoto(media=img) for img in downloaded_images],
            reply_to_message_id=message.id
        )

        # Cleanup the downloaded images after sending
        for img in downloaded_images:
            os.remove(img)

        await msg.delete()

    except Exception as e:
        # Handle errors while sending images
        await msg.delete()
        return await message.reply(f"❍ ᴇʀʀᴏʀ ɪɴ sᴇɴᴅɪɴɢ ɪᴍᴀɢᴇs: {e}")

