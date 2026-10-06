import { useState, useEffect } from 'react'

const STORAGE_KEY = 'loom_fragments'

function loadFragments() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
    catch { return [] }
}
function saveFragments(frags) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(frags))
}

// ─── Archive Tab ────────────────────────────────────────────────────────────
function ArchiveTab() {
    const [fragments, setFragments] = useState(loadFragments)
    const [draft, setDraft] = useState('')

    const addFragment = () => {
        if (!draft.trim()) return
        const updated = [...fragments, {
            id: Date.now(),
            text: draft.trim(),
            date: new Date().toISOString()
        }]
        setFragments(updated)
        saveFragments(updated)
        setDraft('')
    }

    const deleteFragment = (id) => {
        const updated = fragments.filter(f => f.id !== id)
        setFragments(updated)
        saveFragments(updated)
    }

    const formatDate = (iso) => {
        const d = new Date(iso)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div>
            <div className="card">
                <div className="card-title">🗂️ Add a Fragment</div>
                <div className="card-sub">
                    A fragment is anything true — a memory that shaped you, a pattern you keep repeating,
                    a feeling you can't name, a moment you can't forget. No format required. Just honest.
                </div>
                <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder="I keep ending up in situations where I'm the one who holds everything together..."
                    rows={4}
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addFragment() }}
                />
                <div className="btn-row">
                    <button className="btn btn-gold" onClick={addFragment} disabled={!draft.trim()}>
                        ✦ Add to Archive
                    </button>
                    <span style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>
                        {fragments.length} fragment{fragments.length !== 1 ? 's' : ''} archived
                    </span>
                </div>
            </div>

            {fragments.length === 0 ? (
                <div className="empty">
                    <div className="empty-icon">🧵</div>
                    <div className="empty-text">
                        Your archive is empty.<br />
                        Add a few fragments — then The Weave will show you what they mean together.
                    </div>
                </div>
            ) : (
                <div className="fragment-list">
                    {[...fragments].reverse().map(f => (
                        <div className="fragment-item" key={f.id}>
                            <div className="fragment-dot" />
                            <div style={{ flex: 1 }}>
                                <div className="fragment-text">{f.text}</div>
                                <div className="fragment-date">{formatDate(f.date)}</div>
                            </div>
                            <button className="fragment-del" onClick={() => deleteFragment(f.id)} title="Remove">×</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── The Weave Tab ───────────────────────────────────────────────────────────
function WeaveTab() {
    const [loading, setLoading] = useState(false)
    const [myth, setMyth] = useState(null)
    const [error, setError] = useState(null)
    const fragments = loadFragments()

    const weave = async () => {
        if (fragments.length < 2) return
        setLoading(true)
        setMyth(null)
        setError(null)
        try {
            const res = await fetch('/api/weave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fragments: fragments.map(f => f.text) })
            })
            const data = await res.json()
            if (data.error) setError(data.error)
            else setMyth(data)
        } catch {
            setError('Could not reach the server. Please try again.')
        }
        setLoading(false)
    }

    return (
        <div>
            <div className="card">
                <div className="card-title">🕸️ The Weave</div>
                <div className="card-sub">
                    The Loom reads all your fragments together and surfaces the hidden pattern —
                    your core archetypes, the through-line connecting every chapter,
                    and what chapter of your life you're living right now.
                </div>
                <div className="btn-row">
                    <button
                        className="btn btn-gold"
                        onClick={weave}
                        disabled={loading || fragments.length < 2}
                    >
                        {loading ? '⟳ Weaving...' : '✦ Weave My Mythology'}
                    </button>
                    {fragments.length < 2 && (
                        <span style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>
                            Add at least 2 fragments in the Archive first
                        </span>
                    )}
                </div>
            </div>

            {loading && (
                <div className="loading">
                    <div className="spinner" />
                    Reading the threads of your story...
                </div>
            )}

            {error && (
                <div className="card" style={{ borderColor: 'rgba(248,113,113,0.3)' }}>
                    <div style={{ color: '#f87171' }}>{error}</div>
                </div>
            )}

            {myth && (
                <div className="myth-output">
                    <div className="myth-section">
                        <div className="myth-label">Your Archetypes</div>
                        <div className="archetypes">
                            {myth.archetypes?.map((a, i) => (
                                <span className="archetype-tag" key={i}>{a}</span>
                            ))}
                        </div>
                    </div>

                    <div className="myth-section">
                        <div className="myth-label">The Through-Line</div>
                        <div className="myth-text">{myth.through_line}</div>
                    </div>

                    <div className="myth-section">
                        <div className="myth-label">Core Wound & Gift</div>
                        <div className="myth-text">{myth.wound_and_gift}</div>
                    </div>

                    <div className="myth-section">
                        <div className="myth-label">The Current Chapter</div>
                        <div className="myth-text">{myth.current_chapter}</div>
                    </div>

                    <div className="myth-section">
                        <div className="myth-label">Your Myth</div>
                        <div className="myth-text" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.02rem', lineHeight: 1.85 }}>
                            {myth.full_myth}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── The Next Page Tab ───────────────────────────────────────────────────────
function NextPageTab() {
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [oracle, setOracle] = useState(null)
    const [error, setError] = useState(null)
    const fragments = loadFragments()

    const ask = async () => {
        if (!question.trim() || fragments.length < 1) return
        setLoading(true)
        setOracle(null)
        setError(null)
        try {
            const res = await fetch('/api/nextpage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: question.trim(),
                    fragments: fragments.map(f => f.text)
                })
            })
            const data = await res.json()
            if (data.error) setError(data.error)
            else setOracle(data)
        } catch {
            setError('Could not reach the server. Please try again.')
        }
        setLoading(false)
    }

    return (
        <div>
            <div className="card">
                <div className="card-title">📖 The Next Page</div>
                <div className="card-sub">
                    Bring The Loom a decision, a crossroads, or a question you keep circling.
                    It will answer not with generic advice — but through the lens of your own story,
                    using everything you've shared in your Archive.
                </div>
                <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Should I stay in this relationship? Why do I keep self-sabotaging right when things are going well? What is this fear that keeps showing up?"
                    rows={3}
                />
                <div className="btn-row">
                    <button
                        className="btn btn-gold"
                        onClick={ask}
                        disabled={loading || !question.trim() || fragments.length < 1}
                    >
                        {loading ? '⟳ Reading your story...' : '✦ Ask The Oracle'}
                    </button>
                    {fragments.length < 1 && (
                        <span style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>
                            Add fragments to your Archive first
                        </span>
                    )}
                </div>
            </div>

            {loading && (
                <div className="loading">
                    <div className="spinner" />
                    The Loom is reading your story...
                </div>
            )}

            {error && (
                <div className="card" style={{ borderColor: 'rgba(248,113,113,0.3)' }}>
                    <div style={{ color: '#f87171' }}>{error}</div>
                </div>
            )}

            {oracle && (
                <div className="oracle-output">
                    <div className="myth-label" style={{ color: 'var(--teal)', marginBottom: '0.75rem' }}>
                        What Your Story Says
                    </div>
                    <div className="oracle-response">{oracle.response}</div>
                    {oracle.pattern_connection && (
                        <div className="oracle-thread">
                            <strong style={{ display: 'block', marginBottom: '0.35rem' }}>🔗 The Pattern:</strong>
                            {oracle.pattern_connection}
                        </div>
                    )}
                    {oracle.invitation && (
                        <div className="oracle-thread" style={{ color: 'var(--gold)', borderColor: 'rgba(201,168,76,0.2)' }}>
                            <strong style={{ display: 'block', marginBottom: '0.35rem' }}>✦ An Invitation:</strong>
                            {oracle.invitation}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
    const [tab, setTab] = useState('archive')

    const tabs = [
        { id: 'archive', label: '🗂️ The Archive' },
        { id: 'weave', label: '🕸️ The Weave' },
        { id: 'nextpage', label: '📖 The Next Page' },
    ]

    return (
        <div className="app">
            <div className="bg-orbs">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <header>
                <div className="header-badge">Personal Mythology Engine</div>
                <h1 className="header-title">The Loom</h1>
                <p className="header-sub">Weave the scattered threads of your life into a story you can see.</p>
            </header>

            <div className="tabs">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`tab ${tab === t.id ? 'active' : ''}`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <main className="panel">
                {tab === 'archive' && <ArchiveTab />}
                {tab === 'weave' && <WeaveTab />}
                {tab === 'nextpage' && <NextPageTab />}
            </main>

            <footer>
                A companion to <a href="https://partnership-hub.vercel.app" target="_blank">The Partnership Project</a>
                {' '}· Your story is yours alone — nothing leaves your browser ·{' '}
                <a href="https://frontend-six-mauve-s74wp98k8l.vercel.app" target="_blank">The Solarium →</a>
            </footer>
        </div>
    )
}
