import { NextRequest, NextResponse } from 'next/server';
import { fetchMetadata } from '@/lib/scraper';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        const metadata = await fetchMetadata(url);

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Preview API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch preview' },
            { status: 500 }
        );
    }
}
