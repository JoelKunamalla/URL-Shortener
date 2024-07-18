export function customHash(fullUrl) {
    let hash = 0;
    for (let i = 0; i < fullUrl.length; i++) {
        const char = fullUrl.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & 0xFFFFFFFF; // Ensure the hash is a 32-bit integer
    }
    return Math.abs(hash).toString(36).slice(0, 6);
}
