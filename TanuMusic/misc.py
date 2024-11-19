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
    global db
    global clonedb
    db = {}
    clonedb = {}
    LOGGER(__name__).info(f"✦ Local Database Initialized...💛.")


async def sudo():
    global SUDOERS
    OWNER = config.OWNER_ID
    if config.MONGO_DB_URI is None:
        for user_id in OWNER:
            SUDOERS.add(user_id)
    else:
        sudoersdb = mongodb.sudoers
        sudoers = await sudoersdb.find_one({"sudo": "sudo"})  # Await the database call
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
            for x in sudoers:
                SUDOERS.add(x)
    LOGGER(__name__).info(f"✦ Sudoers Loaded...❤️.")


def heroku():
    global HAPP
    if is_heroku:
        if config.HEROKU_API_KEY and config.HEROKU_APP_NAME:
            try:
                Heroku = heroku3.from_key(config.HEROKU_API_KEY)
                HAPP = Heroku.app(config.HEROKU_APP_NAME)
                LOGGER(__name__).info(f"✦ Heroku App Configured...💙")
            except BaseException:
                LOGGER(__name__).warning(
                    f"✦ Please make sure your Heroku API Key and Your App name are configured correctly in the heroku...💚."
                )