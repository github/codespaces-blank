from pyrogram import Client


api_id = int(input("API ID: "))
api_hash = input("API HASH: ")

app = Client("my_app", api_id=api_id, api_hash=api_hash, in_memory=True)
with app:
    print(app.export_session_string())
