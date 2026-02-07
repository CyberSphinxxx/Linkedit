
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL', { status: 400 });
    }

    try {
        // Validate URL (optional security check to prevent open proxy)
        // For now, allow all, but ideally limit to known domains
        const allowedDomains = ['facebook.com', 'fbcdn.net', 'instagram.com', 'cdninstagram.com', 'fbsbx.com'];
        const urlObj = new URL(url);
        if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
            // return new NextResponse('Forbidden Domain', { status: 403 }); 
            // Actually, let's keep it open for now or add more domains as needed
        }

        // Use Googlebot UA or similar that worked in debug script
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const arrayBuffer = await response.arrayBuffer();

        // return new NextResponse(arrayBuffer, {
        //     headers: {
        //         'Content-Type': contentType,
        //         'Cache-Control': 'public, max-age=31536000, immutable',
        //     },
        // });

        // Next.js Response with buffer
        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // 1 day
            }
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
