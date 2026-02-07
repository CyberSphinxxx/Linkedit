
function decodeHtmlEntities(text) {
    if (!text) return '';
    const entities = {
        '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
        '&nbsp;': ' ', '&#xb7;': '·', '&copy;': '©', '&reg;': '®', '&trade;': '™'
    };
    return text.replace(/&[a-z0-9]+;|&#x[0-9a-f]+;|&#[0-9]+;/gi, (match) => {
        if (entities[match]) return entities[match];
        if (match.startsWith('&#x')) {
            // Check if this logic handles high surrogate pairs correctly
            const code = parseInt(match.slice(3, -1), 16);
            return String.fromCodePoint(code); // Use fromCodePoint instead of fromCharCode
        }
        if (match.startsWith('&#')) {
            const code = parseInt(match.slice(2, -1), 10);
            return String.fromCodePoint(code);
        }
        return match;
    });
}

const raw = "DICT Region 10 - &#x1d416;&#x1d400;&#x1d415;&#x1d404; 4 &#x1d408;&#x1d412; &#x1d407;&#x1d404;&#x1d411;&#x1d404;!";
console.log("Original:", raw);
try {
    const decoded = decodeHtmlEntities(raw);
    console.log("Decoded:", decoded);
} catch (e) {
    console.error("Decode failed:", e);
}

// Check difference between fromCharCode and fromCodePoint
const code = 0x1d416;
console.log("fromCharCode:", String.fromCharCode(code)); // Might fail/garbage
console.log("fromCodePoint:", String.fromCodePoint(code)); // Should be 𝐖
