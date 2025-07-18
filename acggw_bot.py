import requests
from bs4 import BeautifulSoup
import urllib.parse
import time
import random

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

class ACGGWCrawler:
    def __init__(self):
        self.base_url = "https://www.acggw.me"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
        self.session = requests.Session()

    def search(self, keyword: str, max_pages: int = 1):
        encoded_keyword = urllib.parse.quote(keyword)
        results = []
        for page in range(1, max_pages + 1):
            url = f"{self.base_url}/page/{page}/?s={encoded_keyword}" if page > 1 else f"{self.base_url}/?s={encoded_keyword}"
            try:
                response = self.session.get(url, headers=self.headers, timeout=10)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('article')
                if not articles:
                    break
                for article in articles:
                    result = self._parse_article(article)
                    if result:
                        results.append(result)
                time.sleep(random.uniform(1, 2))
            except Exception as e:
                print(f"Error on page {page}: {e}")
                break
        return results

    def _parse_article(self, article):
        try:
            title_elem = article.find('h2', class_='entry-title')
            title = title_elem.text.strip() if title_elem else "无标题"
            link = title_elem.find('a')['href'] if title_elem and title_elem.find('a') else None
            thumbnail = article.find('img')
            thumbnail_url = thumbnail['src'] if thumbnail and 'src' in thumbnail.attrs else None
            excerpt = article.find('div', class_='entry-summary')
            excerpt_text = excerpt.text.strip() if excerpt else "无简介"
            return {
                'title': title,
                'url': link,
                'thumbnail': thumbnail_url,
                'excerpt': excerpt_text
            }
        except Exception as e:
            print(f"Parse error: {e}")
            return None

crawler = ACGGWCrawler()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("欢迎使用 GalGame 检索器 1.0\n请输入 /search 关键词 进行搜索")

async def search(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = ' '.join(context.args)
    if not query:
        await update.message.reply_text("请提供搜索关键词，如：/search 魔法少女")
        return
    await update.message.reply_text(f"🔍 正在搜索：{query}，请稍等...")
    results = crawler.search(query)
    if not results:
        await update.message.reply_text("未找到任何结果。")
        return
    for result in results:
        msg = f"🎮 <b>{result['title']}</b>\n\n📝 {result['excerpt'][:100]}...\n\n🔗 <a href=\"{result['url']}\">查看详情</a>"
        buttons = [[InlineKeyboardButton("复制链接", url=result['url'])]]
        reply_markup = InlineKeyboardMarkup(buttons)
        if result['thumbnail']:
            await update.message.reply_photo(photo=result['thumbnail'],
                                             caption=msg,
                                             reply_markup=reply_markup,
                                             parse_mode='HTML')
        else:
            await update.message.reply_text(text=msg,
                                            reply_markup=reply_markup,
                                            parse_mode='HTML')

BOT_TOKEN = "7663966008:AAFx0U6h7RSyHNkLWnp5oSVkTDZjlhbu6Cg"

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("search", search))
    print("🤖 Bot 正在运行...")
    app.run_polling()
