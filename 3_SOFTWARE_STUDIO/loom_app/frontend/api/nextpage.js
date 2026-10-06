import axios from 'axios';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function extractJSON(text) {
    try { return JSON.parse(text); } catch { }
    const cleaned = text.replace(/```json|```/g, '').trim();
    try { return JSON.parse(cleaned); } catch { }
    const first = text.indexOf('{'), last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1) return JSON.parse(text.substring(first, last + 1));
    throw new Error('No JSON found');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { question, fragments } = req.body;
    if (!question || !fragments || fragments.length < 1) {
        return res.status(400).json({ error: 'Question and at least 1 fragment required.' });
    }

    const fragmentList = fragments.map((f, i) => `${i + 1}. "${f}"`).join('\n');

    const prompt = `You are The Loom — a Personal Mythology Engine. You have been given the archived fragments of someone's inner life, and now they bring you a question or crossroads.

Your role is NOT to give generic advice. You must answer specifically through the lens of THEIR story — using the patterns, wounds, gifts, and themes that emerge from their fragments.

Their archived fragments:
${fragmentList}

Their question:
"${question}"

Respond with deep, honest, non-generic wisdom that is clearly rooted in THEIR specific story. Do not give advice that could apply to anyone. Reference the patterns you see in their fragments specifically.

Return ONLY a JSON object:
{
  "response": "<Your oracle response — 3-5 sentences, written in second person. Speak directly to what their story reveals about this question. Be honest, not comforting. Be a mirror, not a cheerleader.>",
  "pattern_connection": "<The specific pattern from their fragments that is most relevant to this question — and why. 1-2 sentences.>",
  "invitation": "<A single, specific, actionable question or invitation for reflection that emerges from everything above. Not advice — an opening. 1 sentence.>"
}`;

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );
        const responseText = response.data.candidates[0].content.parts[0].text;
        const data = extractJSON(responseText);
        return res.json(data);
    } catch (err) {
        console.error('nextpage error:', err.message);
        return res.status(500).json({ error: 'The Oracle failed. Please try again.' });
    }
}
