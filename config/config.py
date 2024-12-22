import re
from os import getenv

from dotenv import load_dotenv
from pyrogram import filters

load_dotenv()

#❖ Get this value from my.telegram.org/apps
API_ID = getenv("API_ID", None)
API_HASH = getenv("API_HASH", None)

#❖ Add Owner Username without @ 
OWNER_USERNAME = getenv("OWNER_USERNAME", "EasyWinter")

#❖  Get Your bot username
BOT_USERNAME = getenv("BOT_USERNAME", "SprotifyMusicBot")

#❖  Don't Add style font 
BOT_NAME = getenv("BOT_NAME", "Sprotify Music")

#❖ get Your Assistant User name
ASSUSERNAME = getenv("ASSUSERNAME", "Nanosauruss")

#❖ Get your token from @BotFather on Telegram.
BOT_TOKEN = getenv("BOT_TOKEN")

#❖ Get your mongo url from cloud.mongodb.com
MONGO_DB_URI = getenv("MONGO_DB_URI", None)

DURATION_LIMIT_MIN = int(getenv("DURATION_LIMIT", 600000))

#❖  Chat id of a group for logging bot's activities
LOGGER_ID = int(getenv("LOGGER_ID", "-1001589206452"))

#❖ Get this value from @MissRose_bot on Telegram by /id
OWNER_ID = getenv("OWNER_ID", "1854441420")

#❖  Your heroku app name
HEROKU_APP_NAME = getenv("HEROKU_APP_NAME", None)

#❖  Get it from http://dashboard.heroku.com/account
HEROKU_API_KEY = getenv("HEROKU_API_KEY", None)

UPSTREAM_REPO = getenv(
    "UPSTREAM_REPO",
    "https://github.com/Mister-Man7/SprotifyXMusic",
)

UPSTREAM_BRANCH = getenv("UPSTREAM_BRANCH", "v2")

GIT_TOKEN = getenv(
    "GIT_TOKEN", None
)  #❖ Fill this variable if your upstream repository is private

#❖ Make your bots privacy from telegra.ph and put your url here
PRIVACY_LINK = getenv(
    "PRIVACY_LINK", "https://telegra.ph/Privacy-Policy-for-SprotifyXMusic-11-29"
)

SUPPORT_CHANNEL = getenv("SUPPORT_CHANNEL", "https://t.me/SprotifyNews")
SUPPORT_CHAT = getenv("SUPPORT_CHAT", "https://t.me/datarantinggi")

#❖ Set this to True if you want the assistant to automatically leave chats after an interval
AUTO_LEAVING_ASSISTANT = bool(getenv("AUTO_LEAVING_ASSISTANT", False))


#❖ Get this credentials from https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID = getenv("SPOTIFY_CLIENT_ID", "e319091f771445b18c029299505d5d4f")
SPOTIFY_CLIENT_SECRET = getenv("SPOTIFY_CLIENT_SECRET", "293c334a2861415197a697b2d11dd4de")


#❖ Maximum limit for fetching playlist's track from youtube, spotify, apple links.
PLAYLIST_FETCH_LIMIT = int(getenv("PLAYLIST_FETCH_LIMIT", 2500))


#❖ Telegram audio and video file size limit (in bytes)
TG_AUDIO_FILESIZE_LIMIT = int(getenv("TG_AUDIO_FILESIZE_LIMIT", 104857600))
TG_VIDEO_FILESIZE_LIMIT = int(getenv("TG_VIDEO_FILESIZE_LIMIT", 1073741824))
#❖ Checkout https://www.gbmb.org/mb-to-bytes for converting mb to bytes


#❖ Get your pyrogram v2 session from @StringFatherBot on Telegram
STRING1 = getenv("STRING_SESSION", None)
STRING2 = getenv("STRING_SESSION2", None)
STRING3 = getenv("STRING_SESSION3", None)
STRING4 = getenv("STRING_SESSION4", None)
STRING5 = getenv("STRING_SESSION5", None)


BANNED_USERS = filters.user()
adminlist = {}
lyrical = {}
votemode = {}
autoclean = []
confirmer = {}


START_IMG_URL = getenv(
    "START_IMG_URL", "https://graph.org/file/afe0bf9e6b4fede3afc0e.jpg"
)
PING_IMG_URL = getenv(
    "PING_IMG_URL", "https://graph.org/file/8f6de108a54be6506b693.jpg"
)
PLAYLIST_IMG_URL = "https://graph.org/file/94074fd8f348807833802.jpg"
STATS_IMG_URL = "https://graph.org/file/c9266ed41c1a9b8121185.jpg"
TELEGRAM_AUDIO_URL = "https://graph.org/file/f626eb194b025672eea28.jpg"
TELEGRAM_VIDEO_URL = "https://graph.org/file/f6e977e0046a5b8d17904.jpg"
STREAM_IMG_URL = "https://graph.org/file/7247dcb0ae280ba3b8492.jpg"
SOUNCLOUD_IMG_URL = "https://graph.org/file/199a1bd803d3e8c8d0e43.jpg"
YOUTUBE_IMG_URL = "https://graph.org/file/d902a638d7bcb6653d36f.jpg"
SPOTIFY_ARTIST_IMG_URL = "https://graph.org/file/dc9eb455f86f845f400f8.jpg"
SPOTIFY_ALBUM_IMG_URL = "https://graph.org/file/aacfa8762c016077b7ee9.jpg"
SPOTIFY_PLAYLIST_IMG_URL = "https://graph.org/file/480dbdc265670e833d763.jpg"



def time_to_seconds(time):
    stringt = str(time)
    return sum(int(x) * 60**i for i, x in enumerate(reversed(stringt.split(":"))))


DURATION_LIMIT = int(time_to_seconds(f"{DURATION_LIMIT_MIN}:00"))


if SUPPORT_CHANNEL:
    if not re.match("(?:http|https)://", SUPPORT_CHANNEL):
        raise SystemExit(
            "[ERROR] - Your SUPPORT_CHANNEL url is wrong. Please ensure that it starts with https://"
        )

if SUPPORT_CHAT:
    if not re.match("(?:http|https)://", SUPPORT_CHAT):
        raise SystemExit(
            "[ERROR] - Your SUPPORT_CHAT url is wrong. Please ensure that it starts with https://"
        )
