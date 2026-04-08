export default async function handler(request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Xử lý OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), 
            { status: 405, headers });
    }

    try {
        const { image } = await request.json();

        if (!image || !image.startsWith('data:image')) {
            throw new Error('Dữ liệu ảnh không hợp lệ');
        }

        // Chuyển base64 thành buffer
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const fileName = `webcam-${Date.now()}.jpg`;
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join('/tmp', fileName);

        fs.writeFileSync(filePath, buffer);

        console.log(`✅ Ảnh đã lưu thành công: ${fileName} - Kích thước: ${(buffer.length / 1024).toFixed(1)} KB`);

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: 'Ảnh đã được lưu thành công trên server của bạn!',
                fileName: fileName 
            }),
            { status: 200, headers }
        );

    } catch (error) {
        console.error('Lỗi khi lưu ảnh:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                message: 'Gửi ảnh thất bại: ' + error.message 
            }),
            { status: 500, headers }
        );
    }
}
