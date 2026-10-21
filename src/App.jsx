import { useState } from 'react'
import './App.css'

const DATA_KEYS = ['data', 'results', 'items', 'points', 'values']

function getChartPoints(payload) {
  if (Array.isArray(payload)) {
    if (payload.length === 0) return []

    if (typeof payload[0] === 'number') {
      return payload.map((value, index) => ({ label: `Point ${index + 1}`, value }))
    }

    if (typeof payload[0] === 'object' && payload[0] !== null) {
      const rows = payload
      const keys = Object.keys(rows[0])
      const valueKey = keys.find((key) => rows.some((row) => Number.isFinite(Number(row[key]))))
      const labelKey = keys.find((key) => key !== valueKey && rows.some((row) => row[key] != null))

      if (!valueKey) return []

      return rows
        .filter((row) => Number.isFinite(Number(row[valueKey])))
        .map((row, index) => ({
          label: String(labelKey ? row[labelKey] : `Point ${index + 1}`),
          value: Number(row[valueKey]),
        }))
    }
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.labels) && Array.isArray(payload.values)) {
      return payload.labels
        .map((label, index) => ({ label: String(label), value: Number(payload.values[index]) }))
        .filter((point) => Number.isFinite(point.value))
    }

    for (const key of DATA_KEYS) {
      if (Array.isArray(payload[key])) {
        const points = getChartPoints(payload[key])
        if (points.length > 0) return points
      }
    }
  }

  return []
}

function BarChart({ points }) {
  const width = Math.max(720, points.length * 76)
  const height = 340
  const padding = { top: 24, right: 28, bottom: 68, left: 62 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const minValue = Math.min(0, ...points.map((point) => point.value))
  const maxValue = Math.max(0, ...points.map((point) => point.value))
  const range = maxValue - minValue || 1
  const zeroY = padding.top + (maxValue / range) * chartHeight
  const slotWidth = chartWidth / points.length
  const barWidth = Math.min(42, slotWidth * 0.58)
  const ticks = Array.from({ length: 5 }, (_, index) => maxValue - (range * index) / 4)
  const formatValue = (value) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)

  return (
    <div className="chart-scroll">
      <svg
        className="chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Graphe en barres des résultats de l’analyse"
      >
        {ticks.map((tick, index) => {
          const y = padding.top + (chartHeight * index) / 4
          return (
            <g key={index}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="chart-grid" />
              <text x={padding.left - 12} y={y + 4} textAnchor="end" className="chart-tick">
                {formatValue(tick)}
              </text>
            </g>
          )
        })}
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={zeroY}
          y2={zeroY}
          className="chart-axis"
        />
        {points.map((point, index) => {
          const barHeight = (Math.abs(point.value) / range) * chartHeight
          const x = padding.left + slotWidth * index + (slotWidth - barWidth) / 2
          const y = point.value >= 0 ? zeroY - barHeight : zeroY

          return (
            <g key={`${point.label}-${index}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 1)}
                rx="5"
                className="chart-bar"
              >
                <title>{`${point.label} : ${formatValue(point.value)}`}</title>
              </rect>
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 24}
                textAnchor="middle"
                className="chart-label"
              >
                {point.label.length > 12 ? `${point.label.slice(0, 11)}…` : point.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function App() {
  const [file, setFile] = useState(null)
  const [apiUrl, setApiUrl] = useState('/api/analyze')
  const [points, setPoints] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setPoints([])

    if (!file) {
      setError('Choisissez un fichier texte avant de lancer l’analyse.')
      return
    }

    

    const formData = new FormData()
    formData.append('file', file)
    setStatus('loading')

    try {
      const response = await fetch(apiUrl.trim(), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const details = await response.text()
        throw new Error(details || `L’API a répondu avec le statut ${response.status}.`)
      }

      const result = await response.json()
      const chartPoints = getChartPoints(result)

      if (chartPoints.length === 0) {
        throw new Error(
          'La réponse de l’API ne contient pas de données numériques pour le graphe. Utilisez un tableau de nombres, un tableau d’objets avec une valeur numérique, ou les propriétés « labels » et « values ».',
        )
      }

      setPoints(chartPoints)
      setStatus('success')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Une erreur inconnue est survenue pendant l’analyse.',
      )
      setStatus('error')
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="TextScope, accueil">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>TextScope</span>
        </a>
        <span className="topbar-note">Analyse de fichiers texte</span>
      </header>

      <section className="intro">
        <p className="eyebrow">VOTRE ESPACE D’ANALYSE</p>
        <h1>Donnez du sens à vos données.</h1>
        <p className="intro-copy">
          Importez un fichier texte et visualisez les résultats renvoyés par votre API.
        </p>
      </section>

      <section className="workspace" aria-label="Analyse de fichier">
        <form className="upload-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <span className="step-number">01</span>
            <div>
              <h2>Importer un fichier</h2>
              <p>Choisissez un fichier texte à analyser.</p>
            </div>
          </div>

          <label className={`file-picker${file ? ' has-file' : ''}`}>
            <input
              type="file"
              accept=".txt,text/plain"
              onChange={(event) => {
                setFile(event.target.files?.[0] || null)
                setError('')
              }}
            />
            <span className="upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v4h14v-4" />
              </svg>
            </span>
            <span className="file-picker-text">
              <strong>{file ? file.name : 'Cliquez pour choisir un fichier'}</strong>
              <small>{file ? `${(file.size / 1024).toFixed(1)} Ko` : 'Format accepté : .txt'}</small>
            </span>
            <span className="browse-button">Parcourir</span>
          </label>

          
          <input
          
            id="api-url"
            className="api-input"
            type="text"
            inputMode="url"
            placeholder="https://exemple.com/api/analyze"
            value={apiUrl}
            onChange={(event) => setApiUrl(event.target.value)}
          />
          <p className="field-hint">Envoi en POST avec le fichier dans le champ « file ».</p>

          {error && <p className="error-message" role="alert">{error}</p>}

          <button className="submit-button" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Analyse en cours…
              </>
            ) : (
              <>
                Analyser le fichier
                <span aria-hidden="true">↗</span>
              </>
            )}
          </button>
        </form>

        <section className="results-card" aria-live="polite">
          <div className="card-heading">
            <span className="step-number">02</span>
            <div>
              <h2>Visualisation</h2>
              <p>Le graphe apparaîtra après l’analyse.</p>
            </div>
          </div>
          {points.length > 0 ? (
            <>
              <div className="result-summary">
                <span className="result-dot" />
                <span>{points.length} {points.length > 1 ? 'valeurs affichées' : 'valeur affichée'}</span>
              </div>
              <BarChart points={points} />
              <p className="chart-caption">Valeurs numériques reçues de l’API</p>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-illustration" aria-hidden="true">
                <span className="empty-bar empty-bar-one" />
                <span className="empty-bar empty-bar-two" />
                <span className="empty-bar empty-bar-three" />
                <span className="empty-bar empty-bar-four" />
              </div>
              <strong>{status === 'loading' ? 'Traitement du fichier…' : 'Aucune donnée pour le moment'}</strong>
              <span>
                {status === 'loading'
                  ? 'Nous récupérons les résultats de votre API.'
                  : 'Envoyez un fichier pour afficher les résultats ici.'}
              </span>
            </div>
          )}
        </section>
      </section>

      <footer className="footer">
        <span>TextScope</span>
        <span>Importez · Analysez · Visualisez</span>
      </footer>
    </main>
  )
}

export default App
