from motor.motor_asyncio import AsyncIOMotorClient as _mongo_client_
from pymongo import MongoClient
from pyrogram import Client
import config
from ..logging import LOGGER

# Public MongoDB URL (ensure credentials are secure in production)
TEMP_MONGODB = "mongodb+srv://sprotify:sprotify@musicbot.2mniri9.mongodb.net/?retryWrites=true&w=majority&appName=musicbot"

try:
    # Check if a custom MongoDB URI is provided in the config
    if config.MONGO_DB_URI is None:
        LOGGER(__name__).warning(
            ">> No MongoDB URI provided. Using temporary public MongoDB...💚"
        )

        # Initialize a temporary Pyrogram client to get bot's username
        with Client(
            "SprotifyMusic",
            bot_token=config.BOT_TOKEN,
            api_id=config.API_ID,
            api_hash=config.API_HASH,
        ) as temp_client:
            info = temp_client.get_me()
            username = info.username

        # Connect to MongoDB with bot's username as the database name
        _mongo_async_ = _mongo_client_(TEMP_MONGODB)
        _mongo_sync_ = MongoClient(TEMP_MONGODB)
        mongodb = _mongo_async_[username]
        pymongodb = _mongo_sync_[username]

        LOGGER(__name__).info(f">> Connected to public MongoDB with username: {username}...💛")

    else:
        LOGGER(__name__).info(">> Connecting to your custom MongoDB...💛")

        # Use custom MongoDB URI from config
        _mongo_async_ = _mongo_client_(config.MONGO_DB_URI)
        _mongo_sync_ = MongoClient(config.MONGO_DB_URI)
        mongodb = _mongo_async_["Sprotify"]
        pymongodb = _mongo_sync_["Sprotify"]

        LOGGER(__name__).info(">> Successfully connected to your MongoDB...❤️")

except Exception as e:
    LOGGER(__name__).error(f">> Failed to connect to MongoDB: {str(e)}...💚")
    exit()