HELP_1 = """
>> Admin Commands
┌ pause - Pause the current **playing** stream.
├ resume - Resume the **paused** stream.
├ skip - Skip the current playing stream and start streaming the next track in queue.
├ end or stop - Clears the queue and ends the current playing stream.
├ player - Get an interactive player panel.
├ queue - Shows the queued tracks list.
├ speed or /playback - Adjust the audio playback speed in the group.
└ cspeed or /cplayback - Adjust the audio playback speed in the channel.

>> Loop Stream
┌ /loop [enable/disable] - Enables/disables loop for the ongoing stream. 
└ /loop [1, 2, 3, ...] - Enables the loop for the given value.

>> Shuffle Queue
┌ /shuffle - Shuffle the queue.  
└ /queue - Shows the shuffled queue.

>> Seek Stream
┌ /seek [duration in seconds] - Seek the stream to the given duration.  
└ /seekback [duration in seconds] - Backward seek the stream to the given duration.

>> Powered by Sprotify Music
"""

HELP_2 = """
>> Auth Users
┌ /auth [username/user_id] - Add a user to the bot's auth list.  
├ /unauth [username/user_id] - Remove a user from the bot's auth list.  
└ /authusers - Show the list of authorized users.

>> Powered by Sprotify Music
"""

HELP_3 = """
>> Broadcast Feature
┌ /broadcast [message or reply to a message] - Broadcast a message to the served chats of the bot.  
├ -pin - Pins your broadcasted messages in served chats.  
├ -pinloud - Pins your broadcasted message in served chats and sends notifications to members.  
├ -user - Broadcasts the message to the users who have started your bot.  
├ -assistant - Broadcast your message from the assistant account of the bot.  
└ -nobot - Forces the bot not to broadcast the message.

Example: /broadcast -user -assistant -pin Testing Broadcast

>> Powered by Sprotify Music
"""

HELP_4 = """
>> Chat Blacklist Feature
┌ /blacklistchat [chat_id] - Blacklist a chat from using the bot.  
├ /whitelistchat [chat_id] - Whitelist a blacklisted chat.  
└ /blacklistedchat - Shows the list of blacklisted chats.

>> Block Users
┌ /block [username or reply to a user] - Block the user from the bot.  
├ /unblock [username or reply to a user] - Unblock the user.  
└ /blockedusers - Shows the list of blocked users.

>> Global Ban Feature
┌ /gban [username or reply to a user] - Globally ban a user from all served chats.  
├ /ungban [username or reply to a user] - Globally unban a user.  
└ /gbannedusers - Shows the list of globally banned users.

>> Maintenance Mode
┌ /logs - Get logs of the bot.  
├ /logger [enable/disable] - Enable or disable logging of the bot activities.  
└ /maintenance [enable/disable] - Enable or disable maintenance mode of the bot

>> Powered by Sprotify Music
"""

HELP_5 = """
>> Play Commands
┌ v - Stands for video play.  
├ force - Stands for force play.  
├ /play or /vplay - Starts streaming the requested track on video chat.  
└ /playforce or /vplayforce - Stops the ongoing stream and starts streaming the requested track.

>> Channel Play Commands
┌ /cplay - Starts streaming the requested track in the linked channel.  
├ /cplayforce or /cvplayforce - Stops the ongoing stream and starts streaming the requested track.  
└ /channelplay [chat username or ID] or [disable] - Connect a channel to a group and start streaming tracks by commands sent in the group.

Powered by Sprotify Music
"""

HELP_6 = """
>> Song Download

┌ /song [song name] - Download any track from Spotify in MP4 format /song [song name] - Download any track from Spotify in MP4 format
└ Note: This Plugin's still bug, dev too lazy to fix it.

Powered by Sprotify Music
"""

HELP_7 = """
>> Create Quotly

┌ /q - Create a quote from the message.
└ add r to quote reply message

Powered by Sprotify Music
"""

HELP_8 = """
>> Sticker Features

┌ /stickerid - Reply to a sticker to get its file ID.
└ /kang - Reply to a sticker to add it to your pack.

Powered by Sprotify Music
"""

HELP_9 = """
>> Image Features

⬤ /image - Provide a query to scrape an image from Google.

Powered by Sprotify Music
"""