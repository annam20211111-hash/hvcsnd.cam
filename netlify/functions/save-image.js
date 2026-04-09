// netlify/functions/save-image.js
import { getStore } from "@netlify/blobs";

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { image } = await request.json();

    if (!image || !image.startsWith("data:image")) {
      throw new Error("Không có dữ liệu ảnh hợp lệ");
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // ==================== NETLIFY BLOBS ====================
    const store = getStore({
      name: "webcam-images",
      consistency: "strong"
    });

    const fileName = `webcam-${Date.now()}.jpg`;
    const key = `photos/${fileName}`;

    await store.set(key, buffer);

    const publicUrl = `/.netlify/blobs/webcam-images/${key}`;

    console.log(`✅ Ảnh đã lưu vào Blobs: ${fileName}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Ảnh đã lưu thành công vào Blobs",
        url: publicUrl
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Save error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
