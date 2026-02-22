
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL', { status: 400 });
    }

    try {
        // Validate URL (optional security check to prevent open proxy)
        const allowedDomains = ['facebook.com', 'fbcdn.net', 'instagram.com', 'cdninstagram.com', 'fbsbx.com'];
        const urlObj = new URL(url);

        // For Facebook/Instagram CDNs, the proxy is no longer needed since the client
        // uses referrerPolicy="no-referrer", so we just redirect them to the original URL.
        if (urlObj.hostname.includes('fbcdn.net') || urlObj.hostname.includes('scontent')) {
            return NextResponse.redirect(urlObj.toString(), 302);
        }

        if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
            // return new NextResponse('Forbidden Domain', { status: 403 }); 
            // Actually, let's keep it open for now or add more domains as needed
        }

        // Use a standard browser UA and additional headers to avoid 403 errors from CDNs
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.facebook.com/',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'image',
                'sec-fetch-mode': 'no-cors',
                'sec-fetch-site': 'cross-site',
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
