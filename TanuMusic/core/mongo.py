from motor.motor_asyncio import AsyncIOMotorClient as _mongo_client_
from pymongo import MongoClient
from pyrogram import Client
import config
from ..logging import LOGGER

# Public MongoDB URL (consider keeping credentials secure in real applications)
TEMP_MONGODB = "mongodb+srv://kuldiprathod2003:kuldiprathod2003@cluster0.wxqpikp.mongodb.net/?retryWrites=true&w=majority"

try:
    # Check if a custom MongoDB URI is provided in the config
    if config.MONGO_DB_URI is None:
        LOGGER(__name__).warning(
            "No mongodb found, defaulting to public MongoDB...💚"
        )

        # Initialize a temporary Pyrogram client to retrieve bot's username
        with Client(
            "TannuMusic",
            bot_token=config.BOT_TOKEN,
            api_id=config.API_ID,
            api_hash=config.API_HASH,
        ) as temp_client:
            info = temp_client.get_me()
            username = info.username

        # Connect to MongoDB with the bot's username as the database name
        _mongo_async_ = _mongo_client_(TEMP_MONGODB)
        _mongo_sync_ = MongoClient(TEMP_MONGODB)
        mongodb = _mongo_async_[username]
        pymongodb = _mongo_sync_[username]

        LOGGER(__name__).info(f"Connected to public MongoDB with username: {username}...💛")

    else:
        LOGGER(__name__).info("✦ Connecting to your custom Mongo Database...💛")

        # Use custom MongoDB URI from config
        _mongo_async_ = _mongo_client_(config.MONGO_DB_URI)
        _mongo_sync_ = MongoClient(config.MONGO_DB_URI)
        mongodb = _mongo_async_.Tannu
        pymongodb = _mongo_sync_.Tannu

        LOGGER(__name__).info("✦ Connected to your Mongo Database...❤️")

except Exception as e:
    # Log any exceptions that occur during connection
    LOGGER(__name__).error(f"✦ Failed to connect to your Mongo Database: {str(e)}...💚")
    exit()