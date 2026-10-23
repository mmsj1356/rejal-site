# ربات روبیکا برای بررسی واقعی عضویت کانال Mrejalco
# نصب: pip install rubiapi
from rubiapi import Robot
BOT_TOKEN = "PUT_YOUR_RUBIKA_BOT_TOKEN_HERE"
CHANNEL_GUID = "PUT_CHANNEL_GUID_HERE"
bot = Robot(token=BOT_TOKEN)
@bot.on_message()
def handle(bot, message):
    chat_id = message.chat_id
    if bot.check_join(CHANNEL_GUID, chat_id):
        code = str(abs(hash(chat_id)))[-6:]
        message.reply(f"✅ عضویتت تأیید شد!\nکدت: {code}\nاین کد را در سایت وارد کن تا سفارش باز شود.")
    else:
        message.reply("❌ هنوز عضو کانال نیستی\nاول عضو شو: https://rubika.ir/Mrejalco\nبعد دوباره /start بزن.")
bot.run()