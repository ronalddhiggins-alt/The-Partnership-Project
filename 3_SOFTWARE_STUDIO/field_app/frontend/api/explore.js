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

  const { concept } = req.body;
  if (!concept) return res.status(400).json({ error: 'No concept provided' });

  const prompt = `You are The Field — a living concept library about AI, human evolution, abundance thinking, and the future of human-AI partnership. Explain concepts in plain, accessible language with no jargon. Connect concepts honestly to the human-AI partnership and abundance thinking story. Be honest about challenges as well as opportunities.

A person wants to explore the concept: "${concept}"

Return ONLY a JSON object:
{
  "title": "The concept name as you present it",
  "explanation": "3-4 paragraphs (separated by \\n\\n) exploring the concept honestly, including both its promise and real challenges",
  "connection": "1 sentence connecting this to human-AI evolution or abundance thinking",
  "doorways": [
    {"concept": "Related concept name 1", "teaser": "One sentence on why it connects"},
    {"concept": "Related concept name 2", "teaser": "One sentence on why it connects"},
    {"concept": "Related concept name 3", "teaser": "One sentence on why it connects"}
  ],
  "reflection": "One question for the reader to sit with"
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
    console.error('explore error:', err.message);
    return res.status(500).json({ error: 'Could not explore this concept right now. Please try again.' });
  }
}
