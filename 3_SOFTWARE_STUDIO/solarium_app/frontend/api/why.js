import axios from 'axios';

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function detectCrisis(text) {
    const crisisPatterns = [
        /\b(suicide|suicidal|kill myself|end my life|want to die|don't want to live|no reason to live)\b/i,
        /\b(self.harm|hurt myself|cutting|overdose)\b/i,
        /\b(hopeless|worthless|nobody cares|everyone would be better without me)\b/i,
    ];
    return crisisPatterns.some(p => p.test(text));
}

const CRISIS_RESPONSE = {
    crisis: true,
    message: "I sense something heavy in what you've shared. I'm an AI, and I'm not able to carry this weight with you the way a human can — but humans are ready to help right now.",
    resources: [
        { name: "Suicide & Crisis Lifeline (USA)", contact: "Call or text 988", url: "https://988lifeline.org" },
        { name: "Crisis Text Line", contact: "Text HOME to 741741", url: "https://www.crisistextline.org" },
        { name: "International Resources", contact: "findahelpline.com", url: "https://findahelpline.com" },
    ]
};

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

    const { message, history: chatHistory = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided.' });
    if (detectCrisis(message)) return res.json(CRISIS_RESPONSE);

    const prompt = `You are The Why Detective — a Socratic mirror inside The Solarium app.

Your role: help the user discover the root cause of a behavior, reaction, or feeling through gentle, curious questions. You are NOT a therapist. You are a thinking partner.

Rules:
- Ask ONE question at a time. Never two.
- Each question should go one layer deeper than the last.
- Never judge, diagnose, or moralize.
- Keep your responses SHORT — 1-3 sentences maximum.
- After 4-5 exchanges, if a root cause has emerged, gently name it: "It sounds like at the root of this might be [need/fear]. Does that resonate?"
- If the user seems to have reached an insight, celebrate it briefly and ask: "What would you do differently, knowing this?"

The conversation so far:
${chatHistory.map(m => `${m.role === 'user' ? 'USER' : 'SOLARIUM'}: ${m.content}`).join('\n')}

USER: ${message}

Return ONLY a JSON object:
{
  "response": "<your Socratic response>",
  "insight_reached": <true if a meaningful root cause has been identified, false otherwise>,
  "root_cause": "<the root cause in one sentence if insight_reached, otherwise null>"
}`;

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );
        const responseText = response.data.candidates[0].content.parts[0].text;
        const cleaned = responseText.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleaned);
        return res.json(data);
    } catch (err) {
        console.error('why error:', err.message);
        return res.status(500).json({ error: 'Reflection failed. Please try again.' });
    }
}
