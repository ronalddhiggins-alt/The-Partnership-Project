export const config = { runtime: 'edge' };

function extractJSON(text) {
    try { return JSON.parse(text); } catch { }
    const cleaned = text.replace(/```json|```/g, '').trim();
    try { return JSON.parse(cleaned); } catch { }
    const first = text.indexOf('{'), last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1) return JSON.parse(text.substring(first, last + 1));
    throw new Error('No JSON found');
}

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

export default async function handler(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 200, headers: HEADERS });
    if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: HEADERS });

    const { answer1 = '', answer2 = '', answer3 = '' } = await request.json();
    if (!answer1 || !answer2 || !answer3) return new Response(JSON.stringify({ error: 'All three answers required' }), { status: 400, headers: HEADERS });

    const prompt = `Gently mirror scarcity thinking toward abundance. Warm, honest, never preachy.

Threatens: "${answer1}" | Would lose: "${answer2}" | Abundance opens: "${answer3}"

Return ONLY valid JSON, short sentences:
{"scarcity_flavor":"...","mirror":"...","reframe":"...","invitation":"...","closing":"..."}`;

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                })
            }
        );
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No text');
        const data = extractJSON(text);
        return new Response(JSON.stringify(data), { status: 200, headers: HEADERS });
    } catch (err) {
        console.error('shift error:', err.message);
        return new Response(JSON.stringify({ error: 'Could not process your reflection right now. Please try again.' }), { status: 500, headers: HEADERS });
    }
}
