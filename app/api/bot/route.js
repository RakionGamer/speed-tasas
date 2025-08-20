import { bot } from "../../../lib/telegram";
import { getRates } from "../../../lib/fetchRates";
import { createImageWithRatesEcuador } from "../../../lib/processorEcuador";
import { createImageWithRatesMexico } from "../../../lib/processorMexico";
import { createImageWithRatesVenezuela } from "../../../lib/processorVenezuela";
import { createImageWithRatesPeru } from "../../../lib/processorPeru";
import { createImageWithRatesChile } from "../../../lib/processorChile";
import { createImageWithRatesArgentina } from "../../../lib/processorArgentina";
import { createImageWithRatesBrasil } from "../../../lib/processorBrasil";
import { createImageWithRatesColombia } from "../../../lib/processorColombia";

export async function POST(req) {
  try {
    const update = await req.json();

    const chatId =
      update.message?.chat?.id || update.callback_query?.message?.chat?.id;
    const text = (update.message?.text || "").trim();
    const callbackData = update.callback_query?.data;

    if (update.callback_query) {
      await bot.answerCallbackQuery(update.callback_query.id);
    }

    if (text) {
      await bot.sendMessage(chatId, "👋 ¡Bienvenido! Selecciona una opción:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Ver tasas",
                callback_data: "update_all",
              },
            ],
          ],
        },
      });

      return new Response("ok", { status: 200 });
    }

    if (callbackData === "update_all") {
      const processingMsg = await bot.sendMessage(chatId, "⏳ Procesando imágenes...");
      const rates = await getRates();

      const ecuadorRates = rates["DESDE ECUADOR"];
      const mexicoRates = rates["DESDE MEXICO"];
      const venezuelaRates = rates["DESDE VENEZUELA"];
      const peruRates = rates["DESDE PERU"];
      const chileRates = rates["DESDE CHILE"];
      const argentinaRates = rates["DESDE ARGENTINA"];
      const brasilRates = rates["DESDE BRASIL"];
      const colombiaRates = rates["DESDE COLOMBIA"];

      if (
        !ecuadorRates &&
        !mexicoRates &&
        !venezuelaRates &&
        !peruRates &&
        !chileRates &&
        !argentinaRates &&
        !brasilRates &&
        !colombiaRates
      ) {
        await bot.editMessageText("❌ No encontré tasas", {
          chat_id: chatId,
          message_id: processingMsg.message_id,
        });
        return new Response("ok", { status: 200 });
      }

      await bot.deleteMessage(chatId, processingMsg.message_id);
      const images = [];

      if (chileRates) {
        const chileImg = await createImageWithRatesChile(chileRates);
        images.push({ buffer: chileImg, caption: "📊 Tasas de Chile" });
      }
      if (venezuelaRates) {
        const venezuelaImg = await createImageWithRatesVenezuela(venezuelaRates);
        images.push({ buffer: venezuelaImg, caption: "📊 Tasas de Venezuela" });
      }
      if (brasilRates) {
        const brasilImg = await createImageWithRatesBrasil(brasilRates);
        images.push({ buffer: brasilImg, caption: "📊 Tasas de Brasil" });
      }
      if (argentinaRates) {
        const argentinaImg = await createImageWithRatesArgentina(argentinaRates);
        images.push({ buffer: argentinaImg});
      }
      if (peruRates) {
        const peruImg = await createImageWithRatesPeru(peruRates);
        images.push({ buffer: peruImg });
      }
      if (colombiaRates) {
        const colombiaImg = await createImageWithRatesColombia(colombiaRates);
        images.push({ buffer: colombiaImg });
      }
      if (mexicoRates) {
        const mexicoImg = await createImageWithRatesMexico(mexicoRates);
        images.push({ buffer: mexicoImg});
      }
      if (ecuadorRates) {
        const ecuadorImg = await createImageWithRatesEcuador(ecuadorRates);
        images.push({ buffer: ecuadorImg});
      }

      // 👉 Enviar imágenes en orden
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const isLast = i === images.length - 1;

        await bot.sendPhoto(chatId, img.buffer, {
          caption: img.caption,
          reply_markup: isLast
            ? {
                inline_keyboard: [
                  [
                    {
                      text: "🔄 Actualizar tasas",
                      callback_data: "update_all",
                    },
                  ],
                ],
              }
            : undefined,
        });
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
