
const rawUrl = 'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=123470&amp;get_thumbnail=1';

function decodeHtmlEntities(text) {
    if (!text) return '';
    const entities = {
        '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
        '&nbsp;': ' ', '&#xb7;': '·', '&copy;': '©', '&reg;': '®', '&trade;': '™'
    };
    return text.replace(/&[a-z0-9]+;|&#x[0-9a-f]+;|&#[0-9]+;/gi, (match) => {
        if (entities[match]) return entities[match];
        if (match.startsWith('&#x')) return String.fromCodePoint(parseInt(match.slice(3, -1), 16));
        if (match.startsWith('&#')) return String.fromCodePoint(parseInt(match.slice(2, -1), 10));
        return match;
    });
}

const decoded = decodeHtmlEntities(rawUrl);
console.log("Raw:", rawUrl);
console.log("Decoded:", decoded);

if (decoded.includes('&amp;')) {
    console.log("FAIL: Still encoded");
} else {
    console.log("SUCCESS: Decoded");
}
