import TelegramBot from 'node-telegram-bot-api';

const token = "8325528676:AAG3zjZDhFWprfh_j9ms-R_Hl8OmIsopmPQ";

if (!token) {
  throw new Error("❌ Falta TELEGRAM_BOT_TOKEN en .env.local");
}

export const bot = new TelegramBot(token);
