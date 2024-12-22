import traceback
from functools import wraps

from pyrogram.errors.exceptions.forbidden_403 import ChatWriteForbidden

from config import LOGGER_ID 
from SprotifyMusic import app

def capture_err(func):
    @wraps(func)
    async def capture(client, message, *args, **kwargs):
        try:
            return await func(client, message, *args, **kwargs)
        except ChatWriteForbidden:
            await app.leave_chat(message.chat.id)
            return
        except Exception as err:
            errors = traceback.format_exc()
            error_feedback = split_limits(
                "<b>ERROR </b> | {} | {}\n```command\n{}```\n\n```python\n{}```\n".format(
                    0 if not message.from_user else message.from_user.mention,
                    (
                        0
                        if not message.chat
                        else (
                            f"@{message.chat.username}"
                            if message.chat.username
                            else f"`{message.chat.id}`"
                        )
                    ),
                    message.text or message.caption,
                    "".join(errors),
                ),
            )
            for x in error_feedback:
                await app.send_message(LOG_GROUP_ID, x)
            raise err

    return capture