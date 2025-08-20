import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN || '8325528676:AAG3zjZDhFWprfh_j9ms-R_Hl8OmIsopmPQ';
const bot = new TelegramBot(token);
const webhookUrl = 'https://124eeb0e320b.ngrok-free.app/api/bot';
bot.setWebHook(webhookUrl)
  .then(() => console.log('✅ Webhook configurado en:', webhookUrl))
  .catch(console.error);

bot.getWebHookInfo()
  .then(info => console.log('ℹ️ Info del webhook:', info))
  .catch(console.error);