import { useState } from "react"
import { Search, X } from "lucide-react"

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery("")
    onSearch("fiction")
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--texto-fraco)" }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por título, autor ou tema..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl text-sm focus:outline-none transition-all"
            style={{
              border: "1.5px solid var(--borda)",
              background: "var(--fundo)",
              color: "var(--texto-forte)",
              fontFamily: "'Inter', sans-serif"
            }}
            onFocus={e => e.currentTarget.style.border = "1.5px solid var(--azul-claro)"}
            onBlur={e => e.currentTarget.style.border = "1.5px solid var(--borda)"}
          />
          {query && (
            <button type="button" onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--texto-fraco)" }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button type="submit" disabled={loading || !query.trim()}
          className="px-5 py-3 text-white text-sm font-semibold rounded-2xl transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "var(--azul-medio)", fontFamily: "'Inter', sans-serif" }}>
          {loading ? "..." : "Buscar"}
        </button>
      </div>
    </form>
  )
}