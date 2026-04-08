import { getStore } from "@netlify/blobs";

export default async function handler(request) {
    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const { image } = await request.json();
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const store = getStore("webcam-images");
        const fileName = `webcam-${Date.now()}.jpg`;

        await store.set(fileName, buffer, { contentType: "image/jpeg" });

        console.log(`✅ Ảnh đã lưu: ${fileName}`);

        return new Response(JSON.stringify({ success: true, file: fileName }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error(error);
        return new Response("Error saving image", { status: 500 });
    }
}