import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// Registrar la fuente
const fontPath = path.join(process.cwd(), "fonts", "Oswald-Bold.ttf");
console.log("Cargando fuente desde:", fontPath);

try {
  registerFont(fontPath, { family: "Oswald-Bold" });
  console.log("Fuente registrada correctamente");
} catch (err) {
  console.error("Error al registrar la fuente:", err);
}

export async function createImageWithRatesChile(rates) {
  const imagePath = path.join(process.cwd(), "public", "chile.jpg");
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
    "ARGENTINA": [380, 160],
    "ECUADOR": [380, 255 - 3],
    "PERU": [380, 355 - 3],
    "MEXICO": [380, 464 - 9],
    "COLOMBIA": [380, 578 - 7],
    "BRASIL": [380, 678 - 8],
    "PANAMA": [380, 780 - 8],
    "REP. DOMINICANA": [415, 882],
  };

  for (const [country, value] of Object.entries(rates)) {
    const pos = positions[country];
    if (pos) {
      const text = `${value}`;
      ctx.strokeText(text, pos[0], pos[1]);
      ctx.fillText(text, pos[0], pos[1]);
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

  const x = 856;
  const y = 555;

  ctx.strokeText(date, x, y);
  ctx.fillText(date, x, y);

  ctx.strokeText(horaFinal, x, y + 55);
  ctx.fillText(horaFinal, x, y + 55);

  return canvas.toBuffer("image/png");
}
