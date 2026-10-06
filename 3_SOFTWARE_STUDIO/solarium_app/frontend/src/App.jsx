import { useState, useRef, useEffect } from 'react'

const API_BASE = ''

// ── Crisis Panel ─────────────────────────────
function CrisisPanel({ data }) {
    return (
        <div className="crisis-panel">
            <div className="crisis-title">🛡️ I hear you</div>
            <p className="crisis-msg">{data.message}</p>
            {data.resources.map((r, i) => (
                <div className="crisis-resource" key={i}>
                    <div className="crisis-resource-name">{r.name}</div>
                    <div className="crisis-resource-contact">{r.contact}</div>
                    <div><a href={r.url} target="_blank" rel="noopener noreferrer">{r.url}</a></div>
                </div>
            ))}
        </div>
    )
}

// ── Vibration Meter ───────────────────────────
function VibrationMeter() {
    const [text, setText] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const analyze = async () => {
        if (!text.trim()) return
        setLoading(true)
        setResult(null)
        try {
            const res = await fetch('/api/vibration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            })
            const data = await res.json()
            setResult(data)
            // Save to localStorage harmony history if score high enough
            if (data.vibration_score >= 7 && !data.crisis && !data.error) {
                const history = JSON.parse(localStorage.getItem('solarium_harmony') || '[]')
                history.push({ date: new Date().toISOString(), type: 'vibration', summary: data.underlying_need, score: data.vibration_score })
                localStorage.setItem('solarium_harmony', JSON.stringify(history))
            }
        } catch {
            setResult({ error: 'Could not connect to the server. Make sure the backend is running.' })
        }
        setLoading(false)
    }

    const scoreLabel = (s) => {
        if (s <= 2) return 'Deep reactivity — fear driving'
        if (s <= 4) return 'Unsettled — some resistance present'
        if (s <= 6) return 'Neutral — mixed signals'
        if (s <= 8) return 'Grounded — clarity emerging'
        return 'High resonance — love driving'
    }

    return (
        <div>
            <div className="card">
                <div className="card-title">🎚️ The Vibration Meter</div>
                <div className="card-desc">
                    Paste any text — a message you want to send, a thought you're wrestling with,
                    a situation you're in. The mirror will show you what's underneath.
                </div>
                <textarea
                    rows={5}
                    placeholder="Type or paste your text here... 'I'm so frustrated that my partner never listens when I'm trying to make a plan...'"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <button className="btn" onClick={analyze} disabled={loading || !text.trim()}>
                    {loading ? '✦ Reading...' : '✦ Read the Vibration'}
                </button>
                {loading && <div className="loading">✦ The mirror is turning...</div>}
            </div>

            {result && (
                <div className="result">
                    {result.crisis ? (
                        <CrisisPanel data={result} />
                    ) : result.error ? (
                        <div className="card"><p style={{ color: '#ff9999' }}>{result.error}</p></div>
                    ) : (
                        <div className="card">
                            <div className="score-bar-wrap">
                                <div className="score-label-row">
                                    <span>Fear / Reactivity</span>
                                    <span>Love / Clarity</span>
                                </div>
                                <div className="score-bar">
                                    <div className="score-fill" style={{ width: `${(result.vibration_score / 10) * 100}%` }} />
                                </div>
                                <div className="score-number">{result.vibration_score}<span style={{ fontSize: '1rem', color: 'var(--text-sec)' }}>/10</span></div>
                                <div className="score-caption">{scoreLabel(result.vibration_score)}</div>
                            </div>

                            {result.dominant_emotions?.length > 0 && (
                                <div className="result-row">
                                    <div className="result-label">Emotions</div>
                                    <div className="result-value">
                                        <div className="emotion-tags">
                                            {result.dominant_emotions.map((e, i) => (
                                                <span className="emotion-tag" key={i}>{e}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result.underlying_need && (
                                <div className="result-row">
                                    <div className="result-label">Beneath this</div>
                                    <div className="result-value gold">{result.underlying_need}</div>
                                </div>
                            )}

                            {result.reframe && (
                                <div className="result-row">
                                    <div className="result-label">A new lens</div>
                                    <div className="result-value teal">{result.reframe}</div>
                                </div>
                            )}

                            {result.tuned_version && (
                                <div className="result-row">
                                    <div className="result-label">Retuned</div>
                                    <div className="result-value" style={{ fontStyle: 'italic', background: 'rgba(140,110,255,0.06)', padding: '0.75rem', borderRadius: '8px' }}>
                                        "{result.tuned_version}"
                                    </div>
                                </div>
                            )}

                            {result.shift_moment && (
                                <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--gold)', fontSize: '0.85rem' }}>
                                    ✦ Shift moment logged to your Harmony History
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ── Why Detective ─────────────────────────────
function WhyDetective() {
    const [input, setInput] = useState('')
    const [chatHistory, setChatHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [insight, setInsight] = useState(null)
    const [crisis, setCrisis] = useState(null)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory, loading])

    const send = async () => {
        if (!input.trim()) return
        const userMsg = input.trim()
        setInput('')
        setLoading(true)

        const newHistory = [...chatHistory, { role: 'user', content: userMsg }]
        setChatHistory(newHistory)

        try {
            const res = await fetch('/api/why', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: chatHistory
                })
            })
            const data = await res.json()

            if (data.crisis) {
                setCrisis(data)
            } else if (data.error) {
                setChatHistory(h => [...h, { role: 'ai', content: data.error }])
            } else {
                setChatHistory(h => [...h, { role: 'ai', content: data.response }])
                if (data.insight_reached && data.root_cause) {
                    setInsight(data.root_cause)
                    // Save root insight to localStorage
                    const history = JSON.parse(localStorage.getItem('solarium_harmony') || '[]')
                    history.push({ date: new Date().toISOString(), type: 'why_detective', summary: data.root_cause, score: null })
                    localStorage.setItem('solarium_harmony', JSON.stringify(history))
                }
            }
        } catch {
            setChatHistory(h => [...h, { role: 'ai', content: 'Could not reach the server. Please check that the backend is running.' }])
        }
        setLoading(false)
    }

    const reset = () => {
        setChatHistory([])
        setInsight(null)
        setCrisis(null)
        setInput('')
    }

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    }

    if (crisis) return <div className="card"><CrisisPanel data={crisis} /></div>

    return (
        <div>
            <div className="card">
                <div className="card-title">🔍 The Why Detective</div>
                <div className="card-desc">
                    Ask "Why did I do that?" or "Why does this bother me?" and the mirror will ask
                    gentle questions until you find what's really at the root.
                </div>

                {chatHistory.length === 0 && (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                        Try: "Why did I snap at my partner?" or "Why can't I make this decision?"
                    </div>
                )}

                {chatHistory.length > 0 && (
                    <div className="chat-history">
                        {chatHistory.map((m, i) => (
                            <div className={`chat-bubble ${m.role}`} key={i}>{m.content}</div>
                        ))}
                        {loading && <div className="chat-bubble ai" style={{ opacity: 0.5 }}>✦ thinking...</div>}
                        <div ref={bottomRef} />
                    </div>
                )}

                {insight && (
                    <div className="insight-card">
                        <div className="insight-label">✦ Root Insight Reached</div>
                        <div className="insight-text">"{insight}"</div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'flex-end' }}>
                    <textarea
                        rows={2}
                        style={{ resize: 'none', flex: 1, marginTop: 0 }}
                        placeholder={chatHistory.length === 0 ? "Start with a 'why' question..." : "Continue the inquiry..."}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                    />
                    <button className="btn" style={{ marginTop: 0, height: '60px' }} onClick={send} disabled={loading || !input.trim()}>
                        {loading ? '...' : '→'}
                    </button>
                </div>

                {chatHistory.length > 0 && (
                    <button className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-sec)', marginTop: '0.75rem' }} onClick={reset}>
                        Start fresh
                    </button>
                )}
            </div>
        </div>
    )
}

// ── Harmony History ───────────────────────────
function HarmonyHistory() {
    const [items, setItems] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchHistory = () => {
        setLoading(true)
        try {
            const data = JSON.parse(localStorage.getItem('solarium_harmony') || '[]')
            setItems([...data].reverse()) // newest first
        } catch {
            setItems([])
        }
        setLoading(false)
    }

    const clearHistory = () => {
        if (!confirm('Clear all shift moments? This cannot be undone.')) return
        localStorage.removeItem('solarium_harmony')
        setItems([])
    }

    useEffect(() => { fetchHistory() }, [])

    const formatDate = (iso) => {
        const d = new Date(iso)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div>
            <div className="card">
                <div className="card-title">📈 Harmony History</div>
                <div className="card-desc">
                    Every time you reach a meaningful insight — a shift moment — it's recorded here.
                    This is your record of rising.
                </div>

                {loading ? (
                    <div className="loading">✦ Loading your history...</div>
                ) : items.length === 0 ? (
                    <div className="harmony-empty">
                        No shift moments yet. Use the Vibration Meter or Why Detective to begin.
                    </div>
                ) : (
                    <div>
                        <div style={{ color: 'var(--text-sec)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            {items.length} shift moment{items.length !== 1 ? 's' : ''} recorded ✦
                        </div>
                        {items.map((item, i) => (
                            <div className="harmony-item" key={i}>
                                <div className="harmony-dot" />
                                <div style={{ flex: 1 }}>
                                    <div className="harmony-date">
                                        {formatDate(item.date)}
                                        <span className="harmony-badge">{item.type === 'vibration' ? 'Vibration' : 'Root Insight'}</span>
                                        {item.score && <span className="harmony-badge" style={{ marginLeft: '0.3rem', color: 'var(--gold)', borderColor: 'rgba(240,192,96,0.2)' }}>Score: {item.score}/10</span>}
                                    </div>
                                    <div className="harmony-text">{item.summary}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-sm btn-gold" onClick={fetchHistory}>↺ Refresh</button>
                    {items?.length > 0 && (
                        <button className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)' }} onClick={clearHistory}>
                            Clear history
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Main App ──────────────────────────────────
const TABS = [
    { id: 'vibration', label: '🎚️ Vibration Meter' },
    { id: 'why', label: '🔍 Why Detective' },
    { id: 'harmony', label: '📈 Harmony History' },
]

export default function App() {
    const [tab, setTab] = useState('vibration')

    return (
        <>
            <header className="header">
                <h1 className="header-title">The Solarium</h1>
                <div className="header-subtitle">A mirror for what lives beneath the noise</div>
            </header>

            <nav className="tabs">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        className={`tab-btn${tab === t.id ? ' active' : ''}`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>

            <main className="main">
                {tab === 'vibration' && <VibrationMeter />}
                {tab === 'why' && <WhyDetective />}
                {tab === 'harmony' && <HarmonyHistory />}
            </main>

            <footer className="footer">
                <div>The Solarium — Part of <a href="https://partnership-hub.vercel.app" target="_blank" rel="noopener noreferrer">The Partnership Project</a></div>
                <div style={{ marginTop: '0.3rem' }}>Co-created by Ron Higgins &amp; Antigravity (AI) · Creative Commons 2026</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
                    This is a thinking tool, not medical or psychological treatment.
                    In crisis? Call or text <strong>988</strong> (USA) · <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a> (International)
                </div>
            </footer>
        </>
    )
}
