import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal,
                redirect: 'follow',
            });

            clearTimeout(timeoutId);

            return NextResponse.json({
                url,
                status: response.status,
                ok: response.ok,
            });
        } catch (fetchError) {
            // If HEAD fails, try GET (some servers don't support HEAD)
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(url, {
                    method: 'GET',
                    signal: controller.signal,
                    redirect: 'follow',
                });

                clearTimeout(timeoutId);

                return NextResponse.json({
                    url,
                    status: response.status,
                    ok: response.ok,
                });
            } catch {
                return NextResponse.json({
                    url,
                    status: 0,
                    ok: false,
                    error: 'Failed to reach URL',
                });
            }
        }
    } catch (error) {
        console.error('Check link error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
