import { bot } from "../../../lib/telegram";
import { getRates } from "../../../lib/fetchRates";
import { createImageWithRatesEcuador } from "../../../lib/processorEcuador";
const sentMessages = {};
export async function POST(req) {
  try {
    const update = await req.json();

    const chatId =
      update.message?.chat?.id || update.callback_query?.message?.chat?.id;
    const text = (update.message?.text || "").trim();
    const callbackData = update.callback_query?.data;

    if (!sentMessages[chatId]) sentMessages[chatId] = [];

    if (text === "/start") {
      const msg = await bot.sendMessage(
        chatId,
        "👋 ¡Bienvenido! Selecciona una opción:",
        {
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
        }
      );

      sentMessages[chatId].push(msg.message_id);
      return new Response("ok", { status: 200 });
    }

    if (callbackData === "update_ecuador") {
      const processingMsg = await bot.sendMessage(
        chatId,
        "⏳ Procesando imágenes..."
      );
      sentMessages[chatId].push(processingMsg.message_id);

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

      const photoMsg = await bot.sendPhoto(chatId, imageBuffer, {
        caption: "📊 Tasas de Ecuador",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🔄 Actualizar tasas", callback_data: "update_ecuador" },
              { text: "🗑 Vaciar chat", callback_data: "vaciar_chat" },
            ],
          ],
        },
      });

      sentMessages[chatId].push(photoMsg.message_id);

      return new Response("ok", { status: 200 });
    }

    if (callbackData === "vaciar_chat") {
      try {
        for (const msgId of sentMessages[chatId] || []) {
          try {
            await bot.deleteMessage(chatId, msgId);
          } catch (e) {
            console.error("Error borrando mensaje:", msgId, e.message);
          }
        }
        sentMessages[chatId] = [];
        const confirmMsg = await bot.sendMessage(chatId, "🗑 Chat vaciado.");
        sentMessages[chatId].push(confirmMsg.message_id);
      } catch (e) {
        console.error("Error en vaciar_chat:", e);
      }

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
