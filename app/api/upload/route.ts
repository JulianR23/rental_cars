import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

/**
 * Maneja la subida de archivos al servidor y lo guarda en la carpeta `/public/cars`. Devuelve la URL pública
 * del archivo almacenado.
 * @param {Request} request - Petición HTTP con el archivo a subir.
 * 
 * @returns {Promise<NextResponse>} - Devuelve una respuesta JSON con:
 * - `success: true` y `url: string` si la subida fue exitosa.
 * - `error: string` si ocurrió un problema (por ejemplo, no se envió archivo o error de escritura).
 */

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "cars");
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const fileUrl = `/cars/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}
