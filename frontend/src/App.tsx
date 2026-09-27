import { useState } from 'react'
import './App.css'

export default function App() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Sci-Fi', 'Thriller'])
  const [activeTab, setActiveTab] = useState<'demo' | 'system'>('demo')

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const sampleGenres = ['Sci-Fi', 'Thriller', 'Comedy', 'Drama', 'Action', 'Mystery']

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
          </svg>
          <div>
            <h1 className="brand-title">Midnight Cinema</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="status-badge">● Phase 1 Online</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-container main-content">
        {/* Hero Section */}
        <section className="hero-card">
          <h2 className="hero-title">
            Watch Together. <span>Without Misery.</span>
          </h2>
          <p className="hero-desc">
            A group movie and web series recommendation system engineered for fair picks.
            No spoilers, no arguments, just movies everyone can live with.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" type="button">
              <span>Find Something to Watch</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setActiveTab(activeTab === 'demo' ? 'system' : 'demo')}
            >
              {activeTab === 'demo' ? 'View Architecture Status' : 'View Design Showcase'}
            </button>
          </div>
        </section>

        {/* Dynamic Section */}
        {activeTab === 'demo' ? (
          <div className="preview-grid">
            {/* Design Tokens & Interactive Chips */}
            <div className="preview-card">
              <div className="preview-card-header">
                <h3 className="preview-card-title">Interactive Taste Chips</h3>
                <span className="badge badge-compromise">A11y Ready</span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Space or Enter to toggle. Gold border indicates active selection.
              </p>
              <div className="chips-row">
                {sampleGenres.map(genre => {
                  const isSelected = selectedGenres.includes(genre)
                  return (
                    <button
                      key={genre}
                      type="button"
                      className={`chip ${isSelected ? 'active' : ''}`}
                      data-selected={isSelected}
                      onClick={() => toggleGenre(genre)}
                    >
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                      <span>{genre}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fairness Score Circles */}
            <div className="preview-card">
              <div className="preview-card-header">
                <h3 className="preview-card-title">Fairness & Misery Rule</h3>
                <span className="badge badge-not-rated">Group of 4</span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Green circles indicate 70+ affinity; amber indicates 40–69. No person is left below 40.
              </p>
              <div className="scores-row">
                <div className="score-circle green" title="Host (Rahul): 92%">R</div>
                <div className="score-circle green" title="Guest 1 (Priya): 84%">P</div>
                <div className="score-circle amber" title="Guest 2 (Amey): 65%">A</div>
                <div className="score-circle amber" title="Guest 3 (Sam): 58%">S</div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-accent)' }}>
                    75%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Group Match
                  </div>
                </div>
              </div>
            </div>

            {/* Film Reel Animation */}
            <div className="preview-card">
              <div className="preview-card-header">
                <h3 className="preview-card-title">Finding Picks State</h3>
                <span className="badge badge-compromise">Micro-Animation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.5rem 0' }}>
                <svg className="spinner-reel" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="6" r="1.5" fill="var(--color-accent)" />
                  <circle cx="12" cy="18" r="1.5" fill="var(--color-accent)" />
                  <circle cx="6" cy="12" r="1.5" fill="var(--color-accent)" />
                  <circle cx="18" cy="12" r="1.5" fill="var(--color-accent)" />
                </svg>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Matching 4 people's answers...</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Filtering CBFC certificates & hard-no genres</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="system-status-list">
            <div className="status-item">
              <div className="status-item-label">
                <span className="status-check">✓</span>
                <span>Backend Core (Spring Boot 3.3.4, Java 21, Maven Wrapper)</span>
              </div>
              <span className="badge badge-compromise">Port 8080</span>
            </div>
            <div className="status-item">
              <div className="status-item-label">
                <span className="status-check">✓</span>
                <span>Frontend Core (React 19 + TypeScript, Vite)</span>
              </div>
              <span className="badge badge-compromise">Port 5173</span>
            </div>
            <div className="status-item">
              <div className="status-item-label">
                <span className="status-check">✓</span>
                <span>Design System (Midnight Cinema, Bebas Neue & Inter, Gold #E5A00D)</span>
              </div>
              <span className="badge badge-compromise">Tokens Loaded</span>
            </div>
            <div className="status-item">
              <div className="status-item-label">
                <span className="status-check">✓</span>
                <span>CORS Filter Configured for dev origin (http://localhost:5173)</span>
              </div>
              <span className="badge badge-compromise">Enabled</span>
            </div>
            <div className="status-item">
              <div className="status-item-label">
                <span className="status-check">✓</span>
                <span>Environment Templates & .gitignore config</span>
              </div>
              <span className="badge badge-compromise">Protected</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
