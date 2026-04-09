import { getStore } from "@netlify/blobs";

export default async function handler(request) {
    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const { image } = await request.json();
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const store = getStore("webcam-captures");   // Tên kho lưu trữ

        const fileName = `webcam-${Date.now()}.jpg`;

        await store.set(fileName, buffer, {
            contentType: "image/jpeg",
            metadata: { uploadedAt: new Date().toISOString() }
        });

        console.log(`✅ Dữ liệu đã lưu thành công: ${fileName}`);

        return new Response(
            JSON.stringify({ success: true, message: "Dữ liệu đã lưu" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Lỗi lưu trữ:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
