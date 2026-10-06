const GEMINI_MODEL = 'gemini-2.5-flash-lite';
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

    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'No text provided.' });
    if (detectCrisis(text)) return res.json(CRISIS_RESPONSE);

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const prompt = `You are The Solarium, a compassionate AI mirror for emotional self-discovery.

A user has shared the following text with you:
"""
${text}
"""

Analyze this with warmth, depth, and honesty. Return a JSON object (no markdown, just raw JSON) with this exact structure:
{
  "vibration_score": <integer 1-10, where 1=pure fear/reactivity, 10=pure love/clarity>,
  "dominant_emotions": [<2-3 emotion words detected>],
  "underlying_need": "<the deeper unmet need beneath the surface emotion, in one sentence>",
  "reframe": "<a compassionate reframing, 2-3 sentences>",
  "tuned_version": "<rewritten version only if the text looks like an email/message the user might send, otherwise omit>",
  "shift_moment": <true if vibration_score is 7 or higher, false otherwise>
}`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Gemini API returned error:', response.status, errText);
            return res.status(response.status).json({ error: `Gemini API error: ${response.statusText}` });
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            return res.status(500).json({ error: 'No response generated from Gemini.' });
        }

        const parsed = extractJSON(responseText);
        return res.json(parsed);
    } catch (err) {
        console.error('vibration error:', err);
        return res.status(500).json({ error: 'Analysis failed: ' + err.message });
    }
}
