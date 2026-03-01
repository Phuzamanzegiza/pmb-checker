import { useState, useMemo } from 'react'
import {
  Search, X, List, LayoutGrid, Activity, Stethoscope, Building2, Cog,
  HeartPulse, Siren, UserRound, Globe, Microscope,
  Pill, Brain, Cross, FlaskConical, Scan, Accessibility,
  Scissors, ClipboardList, Bone, Hospital, ShieldPlus
} from 'lucide-react'
import disciplines from './data/disciplines.json'
import './App.css'

const categories = [...new Set(disciplines.map(d => d.category))].sort()

const catCfg = {
  'Allied Health':          { a: '#059669', bg: '#ecfdf5', p: '#d1fae5', t: '#065f46', Icon: Stethoscope },
  'Clinical Services':      { a: '#4f46e5', bg: '#eef2ff', p: '#e0e7ff', t: '#3730a3', Icon: ShieldPlus },
  'Clinical Technology':    { a: '#7c3aed', bg: '#f5f3ff', p: '#ede9fe', t: '#5b21b6', Icon: Cog },
  'Dental':                 { a: '#0891b2', bg: '#ecfeff', p: '#cffafe', t: '#155e75', Icon: Bone },
  'Emergency Services':     { a: '#dc2626', bg: '#fef2f2', p: '#fee2e2', t: '#991b1b', Icon: Siren },
  'Facilities':             { a: '#d97706', bg: '#fffbeb', p: '#fef3c7', t: '#92400e', Icon: Building2 },
  'General Practice':       { a: '#059669', bg: '#ecfdf5', p: '#d1fae5', t: '#065f46', Icon: UserRound },
  'Hospitals':              { a: '#2563eb', bg: '#eff6ff', p: '#dbeafe', t: '#1e40af', Icon: Hospital },
  'International':          { a: '#475569', bg: '#f8fafc', p: '#e2e8f0', t: '#334155', Icon: Globe },
  'Medical Scientists':     { a: '#7c3aed', bg: '#f5f3ff', p: '#ede9fe', t: '#5b21b6', Icon: Microscope },
  'Medical Specialists':    { a: '#0284c7', bg: '#f0f9ff', p: '#e0f2fe', t: '#075985', Icon: HeartPulse },
  'Mental Health':          { a: '#db2777', bg: '#fdf2f8', p: '#fce7f3', t: '#9d174d', Icon: Brain },
  'Nursing':                { a: '#0d9488', bg: '#f0fdfa', p: '#ccfbf1', t: '#115e59', Icon: Cross },
  'Pathology & Laboratory': { a: '#ea580c', bg: '#fff7ed', p: '#ffedd5', t: '#9a3412', Icon: FlaskConical },
  'Pharmacy':               { a: '#16a34a', bg: '#f0fdf4', p: '#dcfce7', t: '#166534', Icon: Pill },
  'Radiology & Imaging':    { a: '#4f46e5', bg: '#eef2ff', p: '#e0e7ff', t: '#3730a3', Icon: Scan },
  'Rehabilitation':         { a: '#65a30d', bg: '#f7fee7', p: '#ecfccb', t: '#3f6212', Icon: Accessibility },
  'Surgical Specialists':   { a: '#e11d48', bg: '#fff1f2', p: '#ffe4e6', t: '#9f1239', Icon: Scissors },
}

function CatIcon({ category, size = 16 }) {
  const cfg = catCfg[category]
  if (!cfg) return <ClipboardList size={size} />
  const { Icon } = cfg
  return <Icon size={size} strokeWidth={2} />
}

function App() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('list')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return disciplines.filter(d => {
      const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory
      if (!q) return matchesCategory
      const fullCode = `${d.code} ${d.sub}`
      const codeNoSpace = `${d.code}${d.sub}`
      return matchesCategory && (
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        fullCode.includes(q) ||
        codeNoSpace.includes(q) ||
        d.code.includes(q)
      )
    })
  }, [search, selectedCategory])

  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(d => {
      if (!groups[d.category]) groups[d.category] = []
      groups[d.category].push(d)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const stats = useMemo(() => ({
    total: disciplines.length,
    categories: categories.length,
    filtered: filtered.length,
  }), [filtered])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-decor header-decor-1" />
        <div className="header-decor header-decor-2" />
        <div className="header-decor header-decor-3" />
        <div className="header-inner">
          <div className="logo-group">
            <div className="logo-mark">
              <Activity size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="logo-title">Discipline Code Search</h1>
              <p className="logo-sub">SA Medical Scheme Provider Disciplines &middot; BI Solutions Reference</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-chip">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-label">Disciplines</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{stats.categories}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="search-area">
        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" size={20} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search by discipline name, code, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
              autoFocus
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="filter-row">
            <div className="category-pills">
              <button
                className={`pill ${selectedCategory === 'All' ? 'pill-active' : ''}`}
                onClick={() => setSelectedCategory('All')}
                style={selectedCategory === 'All' ? { background: '#0f766e' } : {}}
              >
                <ClipboardList size={13} strokeWidth={2.5} /> All
              </button>
              {categories.map(cat => {
                const c = catCfg[cat]
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    className={`pill ${isActive ? 'pill-active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={isActive ? { background: c.a, color: 'white', boxShadow: `0 2px 12px ${c.a}30` } : { color: c.t }}
                  >
                    <CatIcon category={cat} size={13} />
                    {cat}
                  </button>
                )
              })}
            </div>
            <div className="view-toggle">
              <button className={`toggle-btn ${viewMode === 'list' ? 'toggle-active' : ''}`} onClick={() => setViewMode('list')}>
                <List size={16} strokeWidth={2} />
              </button>
              <button className={`toggle-btn ${viewMode === 'grid' ? 'toggle-active' : ''}`} onClick={() => setViewMode('grid')}>
                <LayoutGrid size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results bar */}
      <div className="results-bar">
        <span className="results-count">
          {stats.filtered === stats.total
            ? `Showing all ${stats.total} disciplines`
            : `${stats.filtered} of ${stats.total} disciplines`}
        </span>
      </div>

      {/* Results */}
      <main className="main">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-circle">
              <Search size={36} strokeWidth={1.5} />
            </div>
            <h3>No disciplines found</h3>
            <p>Try a different search term or clear the category filter</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="list-view">
            {grouped.map(([category, items]) => {
              const c = catCfg[category]
              return (
                <div key={category} className="group">
                  <div className="group-header" style={{ borderBottomColor: `${c.a}18` }}>
                    <div className="group-icon-wrap" style={{ background: c.p, color: c.a }}>
                      <CatIcon category={category} size={18} />
                    </div>
                    <span className="group-name" style={{ color: c.t }}>{category}</span>
                    <span className="group-count" style={{ color: c.a, background: c.p }}>{items.length}</span>
                  </div>
                  <div className="group-items">
                    {items.map((d, i) => (
                      <div key={`${d.code}-${d.sub}-${i}`} className="list-item"
                        onMouseEnter={e => { e.currentTarget.style.background = c.bg; e.currentTarget.style.borderColor = `${c.a}15` }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'transparent' }}
                      >
                        <div className="item-code">
                          <span className="code-main">{d.code}</span>
                          <span className="code-sep">&middot;</span>
                          <span className="code-sub">{d.sub}</span>
                        </div>
                        <div className="item-name">{d.name}</div>
                        <span className="item-badge" style={{ color: c.t, background: c.p }}>
                          <CatIcon category={category} size={11} />
                          {category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid-view">
            {filtered.map((d, i) => {
              const c = catCfg[d.category]
              return (
                <div key={`${d.code}-${d.sub}-${i}`} className="grid-card"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.a; e.currentTarget.style.boxShadow = `0 14px 32px ${c.a}12` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div className="card-stripe" style={{ background: `linear-gradient(90deg, ${c.a}, ${c.a}80)` }} />
                  <div className="card-top">
                    <div className="card-icon-wrap" style={{ background: c.p, color: c.a }}>
                      <CatIcon category={d.category} size={20} />
                    </div>
                    <span className="card-code">{d.code} &middot; {d.sub}</span>
                  </div>
                  <div className="card-name">{d.name}</div>
                  <div className="card-category" style={{ color: c.t, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CatIcon category={d.category} size={12} />
                    {d.category}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Medical Scheme Discipline Codes &middot; Source: <a href="https://www.bisolutions.co.za/reports/disciplines.php" target="_blank" rel="noopener noreferrer">BI Solutions</a></p>
        <p className="footer-sub">Built for GEMS Medical Advisory Services</p>
      </footer>
    </div>
  )
}

export default App
