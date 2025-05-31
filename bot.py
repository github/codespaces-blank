import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("DISCORD_BOT_TOKEN")

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ 봇 로그인 성공: {bot.user}")

@bot.command()
async def 안녕(ctx):
    await ctx.send("안녕하세요! 👋 테스트 중입니다.")

bot.run(TOKEN)
