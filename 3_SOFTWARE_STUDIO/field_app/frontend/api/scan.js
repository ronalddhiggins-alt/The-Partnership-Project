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

const systemPrompt = `You are The Field — an interactive abundance literacy companion. Your purpose is to help humans explore their beliefs about AI, technology, and the changing economy through the MIND framework:

🪨 MATERIAL — Physical realities: access, infrastructure, resources, who has what
🧠 INTELLIGENCE — Augmented human capability: what becomes possible when AI amplifies human potential
🌐 NETWORK — Open source reality: who is building, sharing, connecting, what distributed systems exist
🌿 DIVERSITY — Missing perspectives: whose voice is absent, what traditions are uncounted

PRINCIPLES:
- You never tell the person what to conclude. You open doors, never destinations.
- You always end with exactly ONE deepening question — curious, never leading.
- You present each lens with genuine honesty, including real challenges, not just rosy optimism.
- You speak in plain, accessible language. No academic jargon.
- You are warm, curious, and respectful. Never preachy.`;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { belief, history = [] } = req.body;
    if (!belief) return res.status(400).json({ error: 'No belief provided' });

    const historyContext = history.length > 0
        ? '\n\nContext from our conversation so far:\n' + history.map(h => `${h.role === 'user' ? 'Person' : 'Field'}: ${h.text}`).join('\n')
        : '';

    const prompt = `${systemPrompt}${historyContext}

The person has shared this belief or concern: "${belief}"

Respond through the MIND framework. Return ONLY a JSON object:
{
  "material": "2-3 sentences through the Material lens",
  "intelligence": "2-3 sentences through the Intelligence lens",
  "network": "2-3 sentences through the Network lens",
  "diversity": "2-3 sentences through the Diversity lens",
  "question": "One deepening question to take them further"
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
        console.error('scan error:', err.message);
        return res.status(500).json({ error: 'The Field could not process this right now. Please try again.' });
    }
}
