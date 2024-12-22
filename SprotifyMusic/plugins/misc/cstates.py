from pyrogram import Client, filters
import pycountry
from SprotifyMusic import app 
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup


EVAA = [
    [
        InlineKeyboardButton(text="ᴀᴅᴅ ᴍᴇ ʙᴀʙʏ", url=f"https://t.me/TanuMusicxBot?startgroup=true"),
    ],
]

@app.on_message(filters.command("cstats"))
def get_states(client, message):
    try:
        # Extract the country name from the message
        country_name = message.text.split(' ', 1)[1]
        # Fetch the country information
        country = pycountry.countries.get(name=country_name)
        # Get the states (also known as subdivisions) of the country
        states = pycountry.subdivisions.get(country_code=country.alpha_2)
        states_list = [state.name for state in states]
        # Format the states into a message
        states_message = f"✦ ʜᴇʀᴇ ɪs ʏᴏᴜʀ ᴄᴏᴜɴᴛʀʏ {country_name} ᴀʟʟ sᴛᴀᴛᴇs.\n\n" + " ❖ ".join(states_list) 
    except IndexError:
        # No country name was provided
        states_message = "✦ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴄᴏᴜɴᴛʀʏ ɴᴀᴍᴇ ᴀғᴛᴇʀ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ, ʟɪᴋᴇ ᴛʜɪs ➥ /cstats Japan"
    except AttributeError:
        # The country was not found
        states_message = f"✦ ɪ ᴄᴏᴜʟᴅɴ'ᴛ ғɪɴᴅ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ '{country_name}'. ᴘʟᴇᴀsᴇ ᴍᴀᴋᴇ sure ɪᴛ's sᴘᴇʟʟᴇᴅ ᴄᴏʀʀᴇᴄᴛʟʏ."
    
    message.reply_text(states_message, reply_markup=InlineKeyboardMarkup(EVAA),)
  
