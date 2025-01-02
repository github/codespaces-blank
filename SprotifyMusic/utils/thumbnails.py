import os
import re
import aiofiles
import aiohttp
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
from youtubesearchpython.__future__ import VideosSearch

# Load font
font = ImageFont.truetype("SprotifyMusic/assets/font.ttf", 28)
font_nav = ImageFont.truetype("SprotifyMusic/assets/Montserrat-Medium.ttf", 22)  # Font untuk navigation bar
font_nav_bold = ImageFont.truetype("SprotifyMusic/assets/Montserrat-Bold.ttf", 22)  # Font untuk navigation bar
font_bottom = ImageFont.truetype("SprotifyMusic/assets/Montserrat-Medium.ttf", 20)  # Font untuk tulisan bawah

width, height = 1080, 720

outline_color = (255, 255, 255, 255)

def changeImageSize(maxWidth, maxHeight, image):
    widthRatio = maxWidth / image.size[0]
    heightRatio = maxHeight / image.size[1]
    newWidth = int(widthRatio * image.size[0])
    newHeight = int(heightRatio * image.size[1])
    newImage = image.resize((newWidth, newHeight))
    return newImage

def truncate(text):
    words = text.split(" ")
    text1 = ""
    text2 = ""
    for word in words:
        if len(text1) + len(word) < 30:
            text1 += " " + word
        elif len(text2) + len(word) < 30:
            text2 += " " + word

    text1 = text1.strip()
    text2 = text2.strip()
    return [text1, text2]

def crop_rounded_rectangle(img, output_size, border, corner_radius, crop_scale=1.5):
    # pusat potonya
    half_width = img.size[0] / 2
    half_height = img.size[1] / 2
    larger_size = int(output_size * crop_scale)

    img = img.crop(
        (
            half_width - larger_size / 2,
            half_height - larger_size / 2,
            half_width + larger_size / 2,
            half_height + larger_size / 2,
        )
    )

    img = img.resize((output_size - 2 * border, output_size - 2 * border))
    img_last = Image.new("L", size=(output_size, output_size), color="white")

    # bikin mask
    mask_main = Image.new("L", (output_size - 2 * border, output_size - 2 * border), 0)
    draw_main = ImageDraw.Draw(mask_main)
    draw_main.rounded_rectangle(
        (0, 0, output_size - 2 * border, output_size - 2 * border),
        radius=corner_radius,
        fill=255,
    )

    # masukin gambar ke rounded rectangle
    img_last.paste(
        img,
        (border, border),
        mask_main,
        )
    # Membuat border untuk mask
    mask_border = Image.new("L", (output_size, output_size), 0)
    draw_border = ImageDraw.Draw(mask_border)
    draw_border.rounded_rectangle((0, 0, output_size, output_size), radius=corner_radius, fill=255)

    # Membuat gambar akhir dengan border dan mask
    result = Image.composite(img_last, Image.new("RGBA", img_last.size, (0, 0, 0, 0)), mask_border)

    return result

async def get_thumb(videoid):
    if os.path.isfile(f"cache/{videoid}_v4.png"):
        return f"cache/{videoid}_v4.png"

    url = f"https://www.youtube.com/watch?v={videoid}"
    results = VideosSearch(url, limit=1)

    try:
        for result in (await results.next())["result"]:
            try:
                title = result.get("title", "Unsupported Title")
                title = re.sub("\W+", " ", title)
                title = title.title()
            except:
                title = "Unsupported Title"

            duration = result.get("duration", "Unknown Mins")
            views = result.get("viewCount", {}).get("short", "Unknown Views")
            channel = result.get("channel", {}).get("name", "Unknown Channel")

            if "thumbnails" in result and len(result["thumbnails"]) > 0:
                thumbnail = result["thumbnails"][0]["url"].split("?")[0]
            else:
                raise ValueError("Thumbnail not found in search results")

            async with aiohttp.ClientSession() as session:
                async with session.get(thumbnail) as resp:
                    if resp.status == 200:
                        async with aiofiles.open(f"cache/thumb{videoid}.png", mode="wb") as f:
                            await f.write(await resp.read())

            youtube = Image.open(f"cache/thumb{videoid}.png")
            image1 = changeImageSize(1280, 720, youtube)
            image2 = image1.convert("L")
            background = image2.filter(filter=ImageFilter.GaussianBlur(20)).convert("RGBA")
            draw = ImageDraw.Draw(background, "RGBA")
            enhancer = ImageEnhance.Brightness(background)
            background = enhancer.enhance(0.6)
            font = ImageFont.truetype("SprotifyMusic/assets/font.ttf", 30)
            
            corner_radius = 50  # Radius sudut rounded rectangle
            rectangle_thumbnail = crop_rounded_rectangle(youtube, 400, 20, corner_radius)
            rectangle_thumbnail = rectangle_thumbnail.resize((400, 400))
            rectangle_position = (120, 160)  # Menempatkan di sebelah kiri
            background.paste(rectangle_thumbnail, rectangle_position, rectangle_thumbnail)

            text_x_position = 565

            title1 = truncate(title)
            draw.text((10, 10), f"Sprotify Music", fill=outline_color, font=font)

            # Membuat rounded rectangle persegi panjang di atas (kanan) tanpa warna fill
            rect_width, rect_height = 600, 100
            x1, y1 = width - rect_width - 50, (height // 2) - rect_height - 80
            x2, y2 = x1 + rect_width, y1 + rect_height
            draw.rounded_rectangle((x1, y1, x2, y2), radius=20, outline=outline_color, width=3)
            draw.text((x1 + 20, y1 + 30), f"Title: {title1}", fill="white", font=font)

            # Membuat rounded rectangle persegi panjang tengah (kanan) tanpa warna fill
            y1, y2 = (height // 2) - (rect_height // 2), (height // 2) + (rect_height // 2)
            draw.rounded_rectangle((x1, y1, x2, y2), radius=20, outline=outline_color, width=3)
            draw.text((x1 + 20, y1 + 30), f"Channel: {channel}", fill="white", font=font)

            # Membuat rounded rectangle persegi panjang di bawah (kanan) tanpa warna fill
            y1, y2 = (height // 2) + 80, (height // 2) + 80 + rect_height
            draw.rounded_rectangle((x1, y1, x2, y2), radius=20, outline=outline_color, width=3)
            draw.text((x1 + 20, y1 + 30), f"Duration: {duration}", fill="white", font=font)

            # Menambahkan teks di bagian bawah tengah
            text = "Made with Luv by EasyWinter"
            # Menggunakan textbbox untuk mendapatkan ukuran teks
            text_bbox = draw.textbbox((0, 0), text, font=font_bottom)
            text_width = text_bbox[2] - text_bbox[0]  # Lebar teks
            text_height = text_bbox[3] - text_bbox[1]  # Tinggi teks

            # Posisi teks di bagian bawah tengah
            text_x = (width - text_width) // 2  # Posisi tengah
            text_y = height - text_height - 20  # Posisi 20px dari bagian bawah
            draw.text((text_x, text_y), text, fill="white", font=font_bottom)

            try:
                os.remove(f"cache/thumb{videoid}.png")
            except:
                pass
            background.save(f"cache/{videoid}_v4.png")
            return f"cache/{videoid}_v4.png"

    except Exception as e:
        print(f"Error in get_thumb: {e}")
        raise