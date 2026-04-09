import { getStore } from "@netlify/blobs";

export default async function handler(request) {
    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const { image } = await request.json();
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const store = getStore("webcam-captures");
        const fileName = `webcam-${Date.now()}.jpg`;

        await store.set(fileName, buffer, {
            contentType: "image/jpeg",
            metadata: { uploadedAt: new Date().toISOString() }
        });

        console.log(`✅ Ảnh đã lưu: ${fileName}`);

        return new Response(
            JSON.stringify({ success: true, message: "Dữ liệu đã lưu trữ thành công" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Lỗi:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
}