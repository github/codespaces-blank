import socket
import time
import heroku3
from pyrogram import filters

import config
from TanuMusic.core.mongo import mongodb
from .logging import LOGGER

SUDOERS = filters.user()
HAPP = None
_boot_ = time.time()


def is_heroku():
    """Check if the environment is Heroku."""
    return "heroku" in socket.getfqdn()


XCB = [
    "/",
    "@",
    ".",
    "com",
    ":",
    "git",
    "heroku",
    "push",
    str(config.HEROKU_API_KEY),
    "https",
    str(config.HEROKU_APP_NAME),
    "HEAD",
    "master",
]


def dbb():
    """Initialize the local database."""
    global db, clonedb
    db = {}
    clonedb = {}
    LOGGER(__name__).info("✦ Local Database Initialized...💛.")


async def sudo():
    """Load sudoers from the configuration or database."""
    global SUDOERS
    OWNER = config.OWNER_ID
    if config.MONGO_DB_URI is None:
        for user_id in OWNER:
            SUDOERS.add(user_id)
    else:
        sudoersdb = mongodb.sudoers
        sudoers = await sudoersdb.find_one({"sudo": "sudo"})
        sudoers = [] if not sudoers else sudoers.get("sudoers", [])
        for user_id in OWNER:
            SUDOERS.add(user_id)
            if user_id not in sudoers:
                sudoers.append(user_id)
                await sudoersdb.update_one(
                    {"sudo": "sudo"},
                    {"$set": {"sudoers": sudoers}},
                    upsert=True,
                )
        if sudoers:
            for user_id in sudoers:
                SUDOERS.add(user_id)
    LOGGER(__name__).info("✦ Sudoers Loaded...❤️.")


def heroku():
    """Configure the Heroku app."""
    global HAPP
    if is_heroku():
        if config.HEROKU_API_KEY and config.HEROKU_APP_NAME:
            try:
                heroku_client = heroku3.from_key(config.HEROKU_API_KEY)
                HAPP = heroku_client.app(config.HEROKU_APP_NAME)
                LOGGER(__name__).info("✦ Heroku App Configured...💙")
            except Exception as e:
                LOGGER(__name__).warning(
                    "✦ Please make sure your Heroku API Key and Your App name are configured correctly.💚"
                )
                LOGGER(__name__).debug(f"Error: {e}")