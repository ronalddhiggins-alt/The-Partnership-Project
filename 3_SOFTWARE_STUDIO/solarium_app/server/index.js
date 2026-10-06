// Try narrative_auditor .env first (has the key), then fall back to root .env
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../narrative_auditor/server/.env') });
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

const HARMONY_FILE = path.join(__dirname, 'harmony_history.json');

// Load or initialize harmony history
function loadHistory() {
    if (!fs.existsSync(HARMONY_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(HARMONY_FILE, 'utf8')); } catch { return []; }
}
function saveHistory(history) {
    fs.writeFileSync(HARMONY_FILE, JSON.stringify(history, null, 2));
}

// Guardian Protocol: detect crisis language
function detectCrisis(text) {
    const crisisPatterns = [
        /\b(suicide|suicidal|kill myself|end my life|want to die|don't want to live|no reason to live)\b/i,
        /\b(self.harm|hurt myself|cutting|overdose)\b/i,
        /\b(hopeless|worthless|nobody cares|everyone would be better without me)\b/i,
        /\b(radicalize|attack|bomb|shoot|hurt (them|everyone|people))\b/i,
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

// ─────────────────────────────────────────────
// POST /api/vibration — Vibration Meter
// ─────────────────────────────────────────────
app.post('/api/vibration', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided.' });
    if (detectCrisis(text)) return res.json(CRISIS_RESPONSE);

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
  "reframe": "<a compassionate, practical reframing of the situation that honors the user's feelings while offering a higher perspective, 2-3 sentences>",
  "tuned_version": "<a rewritten version of the user's text that keeps the same core message but shifts the emotional frequency from reactivity to grounded clarity — only include this if the text appears to be a message/email the user might send>",
  "shift_moment": <true if this analysis represents a meaningful moment of self-awareness for the user, false otherwise>
}`;

    try {
        const result = await model.generateContent(prompt);
        const raw = result.response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(raw);

        // Log to harmony history: always capture score 7+ readings
        if (data.vibration_score >= 7 || data.shift_moment) {
            const history = loadHistory();
            history.push({
                date: new Date().toISOString(),
                type: 'vibration',
                summary: data.underlying_need,
                score: data.vibration_score
            });
            saveHistory(history);
        }

        res.json(data);
    } catch (err) {
        console.error('/api/vibration error:', err.message);
        res.status(500).json({ error: 'Analysis failed. Please try again.' });
    }
});

// ─────────────────────────────────────────────
// POST /api/why — The Why Detective (Socratic Mirror)
// ─────────────────────────────────────────────
app.post('/api/why', async (req, res) => {
    const { message, history: chatHistory = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided.' });
    if (detectCrisis(message)) return res.json(CRISIS_RESPONSE);

    const systemPrompt = `You are The Why Detective — a Socratic mirror inside The Solarium app.

Your role: help the user discover the root cause of a behavior, reaction, or feeling through gentle, curious questions. You are NOT a therapist. You are a thinking partner.

Rules:
- Ask ONE question at a time. Never two.
- Each question should go one layer deeper than the last.
- Never judge, diagnose, or moralize.
- Keep your responses SHORT — 1-3 sentences maximum.
- After 4-5 exchanges, if a root cause has emerged, gently name it: "It sounds like at the root of this might be [need/fear]. Does that resonate?"
- Always end with something that returns agency to the user.
- If the user seems to have reached an insight, celebrate it briefly and ask: "What would you do differently, knowing this?"

The conversation so far:
${chatHistory.map(m => `${m.role === 'user' ? 'USER' : 'SOLARIUM'}: ${m.content}`).join('\n')}

USER: ${message}

Respond as The Solarium (Why Detective). Return a JSON object with this structure:
{
  "response": "<your Socratic response>",
  "insight_reached": <true if a meaningful root cause has been identified, false otherwise>,
  "root_cause": "<if insight_reached is true, the root cause in one sentence, otherwise null>"
}`;

    try {
        const result = await model.generateContent(systemPrompt);
        const raw = result.response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(raw);

        if (data.insight_reached && data.root_cause) {
            const history = loadHistory();
            history.push({
                date: new Date().toISOString(),
                type: 'why_detective',
                summary: data.root_cause,
                score: null
            });
            saveHistory(history);
        }

        res.json(data);
    } catch (err) {
        console.error('/api/why error:', err.message);
        res.status(500).json({ error: 'Reflection failed. Please try again.' });
    }
});

// ─────────────────────────────────────────────
// GET /api/harmony — Harmony History
// ─────────────────────────────────────────────
app.get('/api/harmony', (req, res) => {
    res.json(loadHistory());
});

// ─────────────────────────────────────────────
// POST /api/harmony/clear — Clear history
// ─────────────────────────────────────────────
app.post('/api/harmony/clear', (req, res) => {
    saveHistory([]);
    res.json({ success: true });
});

const PORT = process.env.SOLARIUM_PORT || 3002;
app.listen(PORT, () => {
    console.log(`✨ Solarium server running on http://localhost:${PORT}`);
    console.log(`   Gemini key: ${(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) ? '✅ Found' : '❌ MISSING'}`);
});
