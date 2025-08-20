import { bot } from "../../../lib/telegram";
import { getRates } from "../../../lib/fetchRates";
import { createImageWithRatesEcuador } from "../../../lib/processorEcuador";

export async function POST(req) {
  try {
    const update = await req.json();

    const chatId =
      update.message?.chat?.id || update.callback_query?.message?.chat?.id;
    const text = (update.message?.text || "").trim();
    const callbackData = update.callback_query?.data;

    if (text === "/start") {
      await bot.sendMessage(chatId, "👋 ¡Bienvenido! Selecciona una opción:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📊 Ver tasas",
                callback_data: "update_ecuador",
              },
            ],
          ],
        },
      });

      return new Response("ok", { status: 200 });
    }

    if (callbackData === "update_ecuador") {
      const processingMsg = await bot.sendMessage(chatId, "⏳ Procesando imágenes...");
      const rates = await getRates();
      const ecuadorRates = rates["DESDE ECUADOR"];
      if (!ecuadorRates) {
        await bot.editMessageText("❌ No encontré tasas", {
          chat_id: chatId,
          message_id: processingMsg.message_id,
        });
        return new Response("ok", { status: 200 });
      }

      const imageBuffer = await createImageWithRatesEcuador(ecuadorRates);
      await bot.deleteMessage(chatId, processingMsg.message_id);
      await bot.sendPhoto(chatId, imageBuffer, {
        caption: "📊 Tasas de Ecuador",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Actualizar tasas",
                callback_data: "update_ecuador",
              },
            ],
          ],
        },
      });

      return new Response("ok", { status: 200 });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("ok", { status: 200 });
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "API Bot funcionando ✅" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
