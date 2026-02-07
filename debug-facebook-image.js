
const url = 'https://www.facebook.com/share/p/1DjZTYRyzK/';
const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
};

async function run() {
    try {
        console.log('Fetching:', url);
        const response = await fetch(url, { headers, redirect: 'follow' });
        const html = await response.text();

        console.log('--- ALL IMAGE TAGS ---');
        const ogImage = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
        const twitterImage = html.match(/<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i);
        const linkImage = html.match(/<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i);

        console.log('og:image:', ogImage ? ogImage[1] : 'None');
        console.log('twitter:image:', twitterImage ? twitterImage[1] : 'None');
        console.log('link image_src:', linkImage ? linkImage[1] : 'None');

        // Check for JSON-LD which might have valid images
        const jsonLd = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
        if (jsonLd) {
            console.log('JSON-LD found, checking for image...');
            try {
                const data = JSON.parse(jsonLd[1]);
                console.log('JSON-LD Image:', data.image || (data.thumbnailUrl ? data.thumbnailUrl : 'None in JSON'));
            } catch (e) {
                console.log('JSON-LD parse error');
            }
        }

        // Also dump the first 5 meta tags to see if we're even getting a valid page
        const metas = html.match(/<meta[^>]+>/g);
        if (metas) {
            console.log('--- FIRST 5 METAS ---');
            metas.slice(0, 5).forEach(m => console.log(m));
        }

    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

run();
