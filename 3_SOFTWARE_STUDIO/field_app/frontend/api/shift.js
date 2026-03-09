import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { answer1, answer2, answer3 } = req.body;
    if (!answer1 || !answer2 || !answer3) return res.status(400).json({ error: 'All three answers required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are The Field — a gentle, honest mirror for scarcity thinking.

A person has answered three questions about their relationship to AI and the changing world:

Question 1: "What aspect of AI or the changing economy feels most threatening to you personally?"
Their answer: "${answer1}"

Question 2: "What would you lose if that fear turned out to be unfounded?"  
Their answer: "${answer2}"

Question 3: "What would become possible if you approached this from abundance instead?"
Their answer: "${answer3}"

Your role: Reflect honestly and gently. Identify the specific flavor of scarcity thinking present (e.g., fear of obsolescence, fear of loss of control, fear of irrelevance, fear of being left behind). Then offer an abundance reframe — not dismissing the real concern, but showing what the same situation looks like from the other side of scarcity. Close with an invitation to hold both truths.

PRINCIPLES:
- Never be dismissive of the fear. It is real and legitimate.
- Never tell them what to believe. Offer the reframe as a possibility, not a correction.
- Be warm, honest, and grounded. Not spiritual bypass ("just think positive!").
- Acknowledge if something they said reveals genuine challenges that abundance thinking doesn't erase.
- If they express something that suggests they are in real distress, gently acknowledge it and encourage them to speak with someone they trust.

Return a JSON object with:
{
  "scarcity_flavor": "Name the specific pattern of scarcity thinking in 1-2 sentences",
  "mirror": "What you observe in their answers — honest, warm, 2-3 sentences",
  "reframe": "The abundance perspective on the same situation — 2-3 sentences. Acknowledge what's real in the fear.",
  "invitation": "A gentle closing invitation — 1-2 sentences asking if they're willing to hold both",
  "closing": "One final reflection or question to carry with them"
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
        res.status(500).json({ error: 'Could not process your reflection right now. Please try again.' });
    }
}
