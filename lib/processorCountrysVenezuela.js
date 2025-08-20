import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

const fontPath = path.join(process.cwd(), "fonts", "Oswald-Bold.ttf");
console.log("Cargando fuente desde:", fontPath);

try {
  registerFont(fontPath, { family: "Oswald-Bold" });
  console.log("Fuente registrada correctamente");
} catch (err) {
  console.error("Error al registrar la fuente:", err);
}

export async function createImageWithRatesCountrysVenezuela(rates) {
  const imagePath = path.join(process.cwd(), "public", "countrysvenezuela.jpg");
  const image = await loadImage(imagePath);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 8;
  ctx.font = "47px Oswald-Bold";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#000000";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const positions = {
    "CHILE": [375, 140 + 15],
    "ARGENTINA": [375, 255 + 25],
    "ECUADOR": [375, 370 + 46],
    "COLOMBIA": [375, 450 + 84],
    "PERU": [375, 550 + 114],
    "MEXICO": [375, 780 + 30],
    "BRASIL": [375, 830 + 102],
  };

  for (const [country, data] of Object.entries(rates)) {
  const pos = positions[country];
  if (pos) {
    ctx.font = "47px Oswald-Bold";
    ctx.lineWidth = 8;
    const text1 = `${data.VENEZUELA}`;
    ctx.strokeText(text1, pos[0], pos[1]);
    ctx.fillText(text1, pos[0], pos[1]);

    ctx.font = "28px Oswald-Bold";
    ctx.lineWidth = 6;
    const text2 = `PM ${data.PM}`;
    ctx.strokeText(text2, pos[0], pos[1] + 55);
    ctx.fillText(text2, pos[0], pos[1] + 55);
  }
}

    const now = new Date().toLocaleString("es-VE", {
    timeZone: "America/Caracas",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  let [date, time] = now.split(" ");
  date = date.replace(",", "");
  const horaFinal = `${time} HRS`;

  ctx.font = "42.25px Oswald-Bold";
  ctx.fillStyle = "#ffffff"; 
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 8;
  const x = 854;
  const y = 539;

  ctx.strokeText(date, x, y);
  ctx.fillText(date, x, y);

  ctx.strokeText(horaFinal, x, y + 55);
  ctx.fillText(horaFinal, x, y + 55);

  return canvas.toBuffer("image/png");
}
