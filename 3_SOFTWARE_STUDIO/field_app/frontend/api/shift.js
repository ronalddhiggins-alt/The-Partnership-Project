import axios from 'axios';

const GEMINI_MODEL = 'gemini-2.5-flash';
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

    const { answer1, answer2, answer3 } = req.body;
    if (!answer1 || !answer2 || !answer3) return res.status(400).json({ error: 'All three answers required' });

    const prompt = `You are The Field — a gentle, honest mirror for scarcity thinking. You help people see where scarcity thinking lives in them and what becomes possible when they shift toward abundance. You are never dismissive of fear. You never tell people what to believe. You are warm, honest, and grounded — not preachy, never spiritual bypass.

A person has answered three questions:

Q1: "What aspect of AI or the changing economy feels most threatening to you personally?"
Answer: "${answer1}"

Q2: "What would you lose if that fear turned out to be unfounded?"
Answer: "${answer2}"

Q3: "What would become possible if you approached this from abundance instead?"
Answer: "${answer3}"

Reflect honestly and gently. Identify the specific flavor of scarcity thinking. Offer an abundance reframe that doesn't dismiss the real concern. Close with an invitation to hold both truths.

Return ONLY a JSON object:
{
  "scarcity_flavor": "Name the specific pattern of scarcity thinking in 1-2 sentences",
  "mirror": "What you observe in their answers — honest, warm, 2-3 sentences",
  "reframe": "The abundance perspective on the same situation — 2-3 sentences, acknowledging what is real in the fear",
  "invitation": "A gentle closing invitation — 1-2 sentences asking if they are willing to hold both",
  "closing": "One final reflection or question to carry with them"
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
        console.error('shift error:', err.message);
        return res.status(500).json({ error: 'Could not process your reflection right now. Please try again.' });
    }
}
