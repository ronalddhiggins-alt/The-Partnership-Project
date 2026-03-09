import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { concept } = req.body;
    if (!concept) return res.status(400).json({ error: 'No concept provided' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are The Field — a living concept library about AI, human evolution, abundance thinking, and the future of human-AI partnership.

A person wants to explore the concept: "${concept}"

Your role: Explain this concept in plain, accessible language — no jargon, no academic abstractions. Write as if explaining to a curious, intelligent person who hasn't studied this formally but deeply cares about the future. Connect it honestly to the human-AI partnership story and abundance thinking where relevant.

Return a JSON object with:
{
  "title": "The concept name, as you'll present it",
  "explanation": "3-4 paragraphs exploring the concept honestly, including both its promise and its real challenges. Never just cheerleading — show the full landscape.",
  "connection": "1 sentence connecting this to human-AI evolution or abundance thinking",
  "doorways": [
    {"concept": "Related concept name 1", "teaser": "One sentence on why it connects"},
    {"concept": "Related concept name 2", "teaser": "One sentence on why it connects"},
    {"concept": "Related concept name 3", "teaser": "One sentence on why it connects"}
  ],
  "reflection": "One question for the reader to sit with"
}

Return only valid JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');

        const parsed = JSON.parse(jsonMatch[0]);
        res.status(200).json(parsed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not explore this concept right now. Please try again.' });
    }
}
