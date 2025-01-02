from SprotifyMusic.core.bot import SprotifyBot
from SprotifyMusic.core.dir import dirr
from SprotifyMusic.core.git import git
from SprotifyMusic.core.userbot import Userbot
from SprotifyMusic.misc import dbb, heroku

from .logging import LOGGER

dirr()
git()
dbb()
heroku()

app = SprotifyBot()
userbot = Userbot()


from .platforms import *

Apple = AppleAPI()
Carbon = CarbonAPI()
SoundCloud = SoundAPI()
Spotify = SpotifyAPI()
Resso = RessoAPI()
Telegram = TeleAPI()
YouTube = YouTubeAPI()
