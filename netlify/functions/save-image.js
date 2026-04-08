export default async function handler(request) {
    // Xử lý CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Xử lý preflight request (OPTIONS)
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
        return new Response('Method not allowed', { 
            status: 405, 
            headers 
        });
    }

    try {
        const { image } = await request.json();

        if (!image) {
            throw new Error("Không có dữ liệu ảnh");
        }

        // Lấy phần base64
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Tạo tên file
        const fileName = `webcam-${Date.now()}.jpg`;

        // Lưu tạm vào /tmp (Netlify cho phép)
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join('/tmp', fileName);

        fs.writeFileSync(filePath, buffer);

        console.log(`✅ Ảnh đã lưu: ${fileName} (${(buffer.length / 1024).toFixed(1)} KB)`);

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: "Ảnh đã được lưu thành công trên server",
                fileName: fileName 
            }),
            { 
                status: 200,
                headers: { ...headers, 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error("Lỗi lưu ảnh:", error);
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { 
                status: 500,
                headers: { ...headers, 'Content-Type': 'application/json' }
            }
        );
    }
}
