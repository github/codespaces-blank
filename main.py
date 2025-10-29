import os
import asyncio
import httpx
from typing import Optional
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters.command import Command
from aiogram.types import Message
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

# Загружаем переменные из .env файла
load_dotenv()

# Переменные окружения
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
GIGACHAT_API_URL = os.getenv("GIGACHAT_API_URL", "https://api.gigachat.ai/api/v1/chat/completions")
GIGACHAT_API_KEY = os.getenv("GIGACHAT_API_KEY")

# Инициализация бота
bot = Bot(token=TELEGRAM_TOKEN)
dp = Dispatcher()

# Определяем состояния FSM (Finite State Machine)
class PostStates(StatesGroup):
    waiting_for_topic = State()

# Асинхронная функция для обращения к GigaChat API
async def generate_post_gigachat(prompt: str) -> Optional[str]:
    """
    Обращается к API GigaChat для генерации текста поста.
    
    Args:
        prompt: Тема для генерации поста
        
    Returns:
        Сгенерированный текст поста или None в случае ошибки
    """
    try:
        headers = {
            "Authorization": f"Bearer {GIGACHAT_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "GigaChat",
            "messages": [
                {
                    "role": "user",
                    "content": f"Напиши интересный пост в социальную сеть на тему: {prompt}. Добавь эмодзи, заголовок и 2-3 абзаца. Форматируй красиво с использованием переносов строк."
                }
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GIGACHAT_API_URL,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Извлекаем сгенерированный текст из ответа
            if "choices" in data and len(data["choices"]) > 0:
                post_text = data["choices"][0]["message"]["content"]
                return post_text
            
            return None
            
    except httpx.HTTPError as e:
        print(f"Ошибка HTTP при обращении к GigaChat API: {e}")
        return None
    except Exception as e:
        print(f"Ошибка при генерации поста: {e}")
        return None

# Обработчик команды /start
@dp.message(Command("start"))
async def cmd_start(message: Message):
    """
    Обработчик команды /start - приветствие пользователя
    """
    await message.answer(
        "Привет! 👋 Я бот для генерации текстовых постов!\n\n"
        "Используй команду /post чтобы создать новый пост.",
        parse_mode="HTML"
    )

# Обработчик команды /post
@dp.message(Command("post"))
async def cmd_post(message: Message, state: FSMContext):
    """
    Обработчик команды /post - начинает процесс создания поста
    """
    await message.answer(
        "📝 Введи тему для поста:\n\n"
        "Например: 'путешествия', 'технология', 'здоровье', 'бизнес' и т.д.",
        parse_mode="HTML"
    )
    # Устанавливаем состояние ожидания темы
    await state.set_state(PostStates.waiting_for_topic)

# Обработчик текстовых сообщений в состоянии ожидания темы
@dp.message(PostStates.waiting_for_topic)
async def process_topic(message: Message, state: FSMContext):
    """
    Обработчик получения темы от пользователя
    """
    topic = message.text
    
    # Отправляем сообщение о загрузке
    loading_msg = await message.answer(
        "🔄 Генерирую пост на основе твоей темы...\n\n"
        "Пожалуйста, подожди...",
        parse_mode="HTML"
    )
    
    # Обращаемся к GigaChat API для генерации поста
    post_text = await generate_post_gigachat(topic)
    
    # Удаляем сообщение о загрузке
    try:
        await bot.delete_message(chat_id=message.chat.id, message_id=loading_msg.message_id)
    except Exception:
        pass
    
    # Отправляем сгенерированный пост
    if post_text:
        formatted_post = (
            f"✨ Вот твой пост на тему: <b>{topic}</b>\n\n"
            f"{post_text}\n\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"Используй /post чтобы создать еще один пост!"
        )
        await message.answer(formatted_post, parse_mode="HTML")
    else:
        await message.answer(
            "❌ Извини, не удалось сгенерировать пост. Пожалуйста, попробуй еще раз позже.\n\n"
            "Используй /post чтобы попробовать снова.",
            parse_mode="HTML"
        )
    
    # Сбрасываем состояние
    await state.clear()

# Обработчик команды /help
@dp.message(Command("help"))
async def cmd_help(message: Message):
    """
    Обработчик команды /help - справка по командам
    """
    help_text = (
        "<b>📚 Справка по командам:</b>\n\n"
        "<b>/start</b> - Начать работу с ботом\n"
        "<b>/post</b> - Создать новый пост\n"
        "<b>/help</b> - Показать эту справку\n\n"
        "<b>Как это работает:</b>\n"
        "1. Используй /post\n"
        "2. Введи тему для поста\n"
        "3. Бот сгенерирует интересный пост с помощью AI\n"
        "4. Пост будет отправлен тебе в сообщении"
    )
    await message.answer(help_text, parse_mode="HTML")

# Основная функция запуска бота
async def main():
    """
    Главная функция для запуска бота
    """
    print("🤖 Бот запущен и ожидает сообщений...")
    try:
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        await bot.session.close()

# Точка входа в программу
if __name__ == "__main__":
    asyncio.run(main())
