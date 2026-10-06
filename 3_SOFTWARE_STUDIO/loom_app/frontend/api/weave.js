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

    const { fragments } = req.body;
    if (!fragments || fragments.length < 2) {
        return res.status(400).json({ error: 'At least 2 fragments required.' });
    }

    const fragmentList = fragments.map((f, i) => `${i + 1}. "${f}"`).join('\n');

    const prompt = `You are The Loom — a Personal Mythology Engine. Your role is to read the fragments of a person's inner life and weave them into a coherent personal mythology.

The user has shared these fragments from their inner world:
${fragmentList}

Analyze these with depth, warmth, and a mythologist's eye. Look for patterns a therapist, biographer, or deeply perceptive friend might see after years of knowing someone.

Return ONLY a JSON object with this exact structure:
{
  "archetypes": ["<2-4 archetypal roles this person embodies, e.g. 'The Bridge Builder', 'The Hidden Witness', 'The Reluctant Sovereign'>"],
  "through_line": "<The single invisible thread connecting all these fragments — the core theme or tension that runs through everything. 2-3 sentences.>",
  "wound_and_gift": "<The core wound (what shaped them) and the unexpected gift it produced. These are almost always two sides of the same coin. 2-3 sentences.>",
  "current_chapter": "<What chapter of their life story they appear to be in right now, and what the narrative seems to be moving toward. 2-3 sentences.>",
  "full_myth": "<A 4-6 sentence personal myth — a poetic, honest retelling of the story you see across all these fragments. Written in second person ('You are someone who...'). This is the mirror. Make it feel true, not flattering.>"
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
        console.error('weave error:', err.message);
        return res.status(500).json({ error: 'The Weave failed. Please try again.' });
    }
}
