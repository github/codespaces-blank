import asyncio
import speedtest
from pyrogram import filters
from pyrogram.types import Message
from SprotifyMusic import app
from SprotifyMusic.misc import SUDOERS
from SprotifyMusic.utils.decorators.language import language


def testspeed(m, _):
    try:
        test = speedtest.Speedtest()
        test.get_best_server()
        m = m.edit_text(_["server_12"])  # Informing about selecting the best server
        test.download()
        m = m.edit_text(_["server_13"])  # Informing about download speed testing
        test.upload()
        test.results.share()
        result = test.results.dict()  # Fetching results as a dictionary
        m = m.edit_text(_["server_14"])  # Informing about finishing the test
        return result
    except Exception as e:
        m.edit_text(f"<code>{e}</code>")  # Display error
        return None


@app.on_message(filters.command(["speedtest", "spt"]))
@language
async def speedtest_function(client, message: Message, _):
    # Initial response
    m = await message.reply_text(_["server_11"])  # Starting speed test message
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, testspeed, m, _)
    
    if result is None:
        return  # Exit if an error occurred and was already handled in testspeed()

    # Prepare and format output
    output = _["server_15"].format(
        result["client"]["isp"],
        result["client"]["country"],
        result["server"]["name"],
        result["server"]["country"],
        result["server"]["cc"],
        result["server"]["sponsor"],
        result["server"]["latency"],
        result["ping"],
    )

    # Send result as a photo
    msg = await message.reply_photo(photo=result["share"], caption=output)
    await m.delete()  # Remove the initial message