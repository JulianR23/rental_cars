import { NextResponse } from "next/server";
/**
 * Simula la subida de imágenes sin escribir en disco.
 * Convierte el archivo en base64 y devuelve una URL simulada.
 * 
 * @param {Request} request - Solicitud HTTP con el FormData que contiene el archivo.
 * @returns {Promise<NextResponse>} Respuesta con la URL de la imagen.
 */
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const fakeUrl = `data:${mimeType};base64,${base64}`;
    return NextResponse.json({ success: true, url: fakeUrl });
  } catch (error) {
    console.error("Error al procesar imagen:", error);
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 });
  }
}
