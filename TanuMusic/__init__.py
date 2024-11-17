from TanuMusic.core.bot import Tanu
from TanuMusic.core.dir import dirr
from TanuMusic.core.git import git
from TanuMusic.core.userbot import Userbot
from TanuMusic.misc import dbb, heroku

from .logging import LOGGER

dirr()
git()
dbb()
heroku()

app = Tanu()
userbot = Userbot()


from .platforms import *

Apple = AppleAPI()
Carbon = CarbonAPI()
SoundCloud = SoundAPI()
Spotify = SpotifyAPI()
Resso = RessoAPI()
Telegram = TeleAPI()
YouTube = YouTubeAPI()
