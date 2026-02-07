
const url = 'https://www.facebook.com/share/r/1EEtmK8seA/';
const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
};

async function run() {
    try {
        console.log('Fetching:', url);
        const response = await fetch(url, { headers, redirect: 'follow' });

        if (response.ok) {
            const html = await response.text();

            // Dump all meta properties to see what we have
            const metaRegex = /<meta\s+(?:property|name)=["']([^"']+)["']\s+content=["']([^"']+)["']/gi;
            let match;
            console.log('--- META TAGS ---');
            while ((match = metaRegex.exec(html)) !== null) {
                console.log(`${match[1]}: ${match[2]}`);
            }

            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            console.log('Title Tag:', titleMatch ? titleMatch[1] : 'None');

        } else {
            console.log('Failed status:', response.status);
        }

    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

run();
