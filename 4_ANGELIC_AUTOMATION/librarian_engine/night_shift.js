const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check for API Key
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL: GEMINI_API_KEY not found in the root .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ARCHIVE_DIR = path.join(__dirname, '../../06_Compressed_Archives');
// Points directly to the hidden .gemini brain folder on the Mac!
const BRAIN_DIR = path.join(os.homedir(), '.gemini/antigravity/brain');
const STATE_FILE = path.join(ARCHIVE_DIR, 'processed_state.json');

if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

// Load timestamps of the logs we have already extracted
let processedState = {};
if (fs.existsSync(STATE_FILE)) {
    processedState = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

console.log(`\n🌌 [NIGHT SHIFT: SYSTEM LOG PARSER ACTIVE]`);
console.log(`🔍 Scanning system backend for new chat logs...`);

async function processSystemLogs() {
    try {
        if (!fs.existsSync(BRAIN_DIR)) {
            console.log(`⚠️ Could not find the brain directory at ${BRAIN_DIR}`);
            return;
        }

        const conversations = fs.readdirSync(BRAIN_DIR);
        
        for (const convo of conversations) {
            const logPath = path.join(BRAIN_DIR, convo, '.system_generated/logs/overview.txt');
            
            if (fs.existsSync(logPath)) {
                const stats = fs.statSync(logPath);
                const lastModified = stats.mtimeMs;

                // Only process if the log is brand new or has been updated since last scan
                if (!processedState[convo] || processedState[convo] < lastModified) {
                    console.log(`\n📥 [NEW CHAT DATA DETECTED]. Pulling from backend ID: ${convo}`);

                    const rawContent = fs.readFileSync(logPath, 'utf8');

                    // Skip empty or tiny logs
                    if (rawContent.length < 500) continue;

                    console.log(`🧠 [PROCESSING]: Handing log to Gemini API for code-cleaning and compression...`);
                    
                    // Use Gemini 2.5 Flash for massive context and blazing speed
                    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                    const prompt = `
You are the Angelic Librarian Agent for The Partnership Project.
Your job is to read the following raw backend system log from a conversation between Ron (The Human) and AG (The AI).
The system log contains huge amounts of hidden computer code, tool calls, JSON configurations, and background noise.

IGNORE all the computer code, file paths, and tool tags (like 'call:default_api...', 'Output:', JSON metadata).
FOCUS ONLY on the actual conversational text spoken natively between the Human (USER) and the AI (ASSISTANT).

Using ONLY the actual conversational text, output TWO distinct sections formatted cleanly in Markdown:

# FULL CLEAN TRANSCRIPT
(Provide a clean, readable reconstruction of the conversation flow. Strip out all behind-the-scenes computer logs and leave only the human-to-AI dialogue).

---

# COMPRESSED ESSENCE
1. **The Core Spark (Intention):** What was the primary driving intention or goal of this session?
2. **Breakthroughs:** What profound new realizations, rules, or architectures were discovered? Extract the deep substance.
3. **Action Items:** What tasks remain unattended or require follow-up?

RAW SYSTEM LOG:
----------------
${rawContent.substring(0, 80000)}
----------------
`;
                    try {
                        const result = await model.generateContent(prompt);
                        const responseText = result.response.text();

                        // Save the beautifully cleaned file
                        const datePrefix = new Date().toISOString().split('T')[0];
                        const compressedPath = path.join(ARCHIVE_DIR, `${datePrefix}_Session_${convo.substring(0,6)}_CLEANED.md`);
                        
                        fs.writeFileSync(compressedPath, responseText.trim(), 'utf8');
                        console.log(`✅ [SUCCESS]: Clean Transcript & Essence successfully saved to ${compressedPath}`);

                        // Securely record that we finished this log
                        processedState[convo] = lastModified;
                        fs.writeFileSync(STATE_FILE, JSON.stringify(processedState, null, 2));

                    } catch (error) {
                        console.error(`💥 [API ERROR on ${convo}]:`, error.message);
                    }
                }
            }
        }
        
        console.log(`\n🏁 [SCAN COMPLETE]. All chats successfully preserved in ` + ARCHIVE_DIR);

    } catch (err) {
        console.error("Error scanning directories:", err);
    }
}

// Run the engine
processSystemLogs();
