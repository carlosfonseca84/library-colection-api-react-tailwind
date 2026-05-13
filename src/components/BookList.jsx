import { useState, useEffect, useCallback, useMemo } from "react"
import { Loader2, BookX } from "lucide-react"
import { searchBooks } from "../services/openLibraryApi"
import BookCard from "./BookCard"
import SearchBar from "./SearchBar"
import CategoryCarousel from "./CategoryCarousel"

const LIMIT = 16

export default function BookList() {
  const [livros, setLivros] = useState([])
  const [query, setQuery] = useState("fiction")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [erro, setErro] = useState(null)
  const [categoriaAtiva, setCategoriaAtiva] = useState(null)

  const carregarLivros = useCallback(async (searchQuery, resetPage = true) => {
    try {
      setCarregando(true)
      setErro(null)
      const currentPage = resetPage ? 1 : page
      const result = await searchBooks(searchQuery, currentPage, LIMIT)
      setLivros(result.books)
      setTotal(result.total)
      if (resetPage) setPage(1)
      setCategoriaAtiva(null)
    } catch {
      setErro("Erro ao buscar livros. Verifique sua conexão.")
    } finally {
      setCarregando(false)
    }
  }, [page])

  const carregarMais = async () => {
    try {
      setCarregandoMais(true)
      const nextPage = page + 1
      const result = await searchBooks(query, nextPage, LIMIT)
      setLivros(prev => [...prev, ...result.books])
      setPage(nextPage)
    } catch {
      setErro("Erro ao carregar mais livros.")
    } finally {
      setCarregandoMais(false)
    }
  }

  const livrosFiltrados = useMemo(() => {
    if (!categoriaAtiva) return livros
    return livros.filter(livro =>
      (livro.subject || livro.subjects || []).includes(categoriaAtiva)
    )
  }, [livros, categoriaAtiva])

  const handleSearch = (newQuery) => {
    setQuery(newQuery)
    carregarLivros(newQuery, true)
  }

  useEffect(() => {
    carregarLivros(query, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const temMais = livros.length < total

  return (
    <div className="min-h-screen" style={{ background: "var(--fundo)" }}>

      {/* Header */}
      <div className="sticky top-0 z-10"
        style={{ background: "#fff", borderBottom: "1px solid var(--borda)", boxShadow: "0 2px 12px rgba(27,58,107,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h1 className="font-editorial text-2xl font-bold flex items-center gap-2"
              style={{ color: "var(--azul-profundo)" }}>
              📚 Dear Book Collection
            </h1>
            {!carregando && (
              <p className="text-xs mt-0.5" style={{ color: "var(--texto-fraco)" }}>
                {total.toLocaleString()} livros para{" "}
                <span style={{ color: "var(--azul-medio)", fontWeight: 600 }}>"{query}"</span>
              </p>
            )}
          </div>
          <SearchBar onSearch={handleSearch} loading={carregando} />
        </div>

        {!carregando && livros.length > 0 && (
          <CategoryCarousel
            livros={livros}
            onSelect={setCategoriaAtiva}
            categoriaSelecionada={categoriaAtiva}
          />
        )}
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {erro && (
          <div className="rounded-2xl px-5 py-4 text-sm mb-6"
            style={{ background: "#FFF5F5", border: "1px solid #FEB2B2", color: "#C53030" }}>
            {erro}
          </div>
        )}

        {/* Skeleton */}
        {carregando && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse"
                style={{ border: "1px solid var(--borda)" }}>
                <div className="h-64" style={{ background: "var(--azul-suave)" }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 rounded-full w-3/4" style={{ background: "var(--borda)" }} />
                  <div className="h-3 rounded-full w-1/2" style={{ background: "var(--azul-suave)" }} />
                  <div className="h-8 rounded-xl mt-3" style={{ background: "var(--azul-suave)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!carregando && livrosFiltrados.length > 0 && (
          <>
            {categoriaAtiva && (
              <p className="text-sm mb-4" style={{ color: "var(--texto-fraco)" }}>
                <span style={{ color: "var(--texto-forte)", fontWeight: 600 }}>{livrosFiltrados.length}</span> livros em{" "}
                <span style={{ color: "var(--azul-medio)", fontWeight: 600 }}>"{categoriaAtiva}"</span>
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {livrosFiltrados.map((book, i) => (
                <BookCard key={`${book.key}-${i}`} book={book} />
              ))}
            </div>

            {temMais && !categoriaAtiva && (
              <div className="flex flex-col items-center mt-10 gap-2">
                <p className="text-xs" style={{ color: "var(--texto-fraco)" }}>
                  Exibindo {livros.length} de {total.toLocaleString()} livros
                </p>
                <button onClick={carregarMais} disabled={carregandoMais}
                  className="px-8 py-3 text-sm font-semibold rounded-2xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#fff", border: "1.5px solid var(--borda)", color: "var(--azul-medio)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = "1.5px solid var(--azul-medio)"
                    e.currentTarget.style.background = "var(--azul-suave)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = "1.5px solid var(--borda)"
                    e.currentTarget.style.background = "#fff"
                  }}>
                  {carregandoMais ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" /> Carregando...
                    </span>
                  ) : "Ver mais livros"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Sem resultados categoria */}
        {!carregando && livrosFiltrados.length === 0 && categoriaAtiva && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <BookX strokeWidth={1} style={{ width: 48, height: 48, color: "var(--borda)" }} />
            <p style={{ color: "var(--texto-medio)" }}>Nenhum livro em "{categoriaAtiva}"</p>
            <button onClick={() => setCategoriaAtiva(null)}
              className="text-sm underline" style={{ color: "var(--azul-claro)" }}>
              Limpar filtro
            </button>
          </div>
        )}

        {/* Sem resultados busca */}
        {!carregando && livros.length === 0 && !erro && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <BookX strokeWidth={1} style={{ width: 48, height: 48, color: "var(--borda)" }} />
            <p style={{ color: "var(--texto-medio)" }}>Nenhum livro para "{query}"</p>
            <button onClick={() => handleSearch("fiction")}
              className="text-sm underline" style={{ color: "var(--azul-claro)" }}>
              Voltar ao catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}