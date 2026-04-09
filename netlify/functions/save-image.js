// netlify/functions/save-image.js
exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    try {
        const { image } = JSON.parse(event.body || "{}");
        
        if (!image || !image.startsWith("data:image")) {
            throw new Error("Invalid image data");
        }

        // Chuyển base64 thành buffer
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Lưu tạm vào /tmp (Netlify cho phép)
        const fs = require("fs");
        const path = require("path");

        const fileName = `webcam-${Date.now()}.jpg`;
        const filePath = path.join("/tmp", fileName);

        fs.writeFileSync(filePath, buffer);

        console.log(`✅ Ảnh đã lưu tạm: ${fileName} (${(buffer.length / 1024).toFixed(1)} KB)`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Ảnh đã được lưu thành công trên server"
            })
        };

    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: error.message || "Internal server error"
            })
        };
    }
};
