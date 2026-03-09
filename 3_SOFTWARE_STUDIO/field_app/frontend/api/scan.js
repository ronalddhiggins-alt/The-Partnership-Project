import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { belief, history = [] } = req.body;
    if (!belief) return res.status(400).json({ error: 'No belief provided' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are The Field — an interactive abundance literacy companion. Your purpose is to help humans explore their beliefs about AI, technology, and the changing economy through the MIND framework:

🪨 MATERIAL — Physical realities: access, infrastructure, resources, who has what
🧠 INTELLIGENCE — Augmented human capability: what becomes possible when AI amplifies human potential
🌐 NETWORK — Open source reality: who is building, sharing, connecting, what distributed systems exist
🌿 DIVERSITY — Missing perspectives: whose voice is absent, what traditions are uncounted

PRINCIPLES YOU ALWAYS FOLLOW:
- You never tell the person what to conclude. You open doors, never destinations.
- You always end with exactly ONE deepening question — curious, never leading.
- You present each lens with genuine honesty, including real challenges, not just rosy optimism.
- You speak in plain, accessible language. No academic jargon.
- You are warm, curious, and respectful. Never preachy.
- If the person seems distressed, acknowledge it gently and suggest they may want to speak with someone they trust.

RESPONSE FORMAT:
Return a JSON object with:
{
  "material": "2-3 sentences through the Material lens",
  "intelligence": "2-3 sentences through the Intelligence lens", 
  "network": "2-3 sentences through the Network lens",
  "diversity": "2-3 sentences through the Diversity lens",
  "question": "One deepening question to take them further"
}`;

    const conversationHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }));

    const chat = model.startChat({
        history: conversationHistory,
        systemInstruction: systemPrompt
    });

    try {
        const result = await chat.sendMessage(
            `The person has shared this belief or concern:\n\n"${belief}"\n\nRespond through the MIND framework. Return only valid JSON.`
        );
        const text = result.response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');

        const parsed = JSON.parse(jsonMatch[0]);
        res.status(200).json(parsed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'The Field could not process this right now. Please try again.' });
    }
}
