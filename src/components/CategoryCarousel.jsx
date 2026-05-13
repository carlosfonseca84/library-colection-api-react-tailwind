import { useState, useMemo, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getCoverUrl } from "../services/openLibraryApi"

export default function CategoryCarousel({ livros, onSelect, categoriaSelecionada }) {
  const [indice, setIndice] = useState(0)
  const carrosselRef = useRef(null)
  const ITEM_WIDTH = 112

  const categorias = useMemo(() => {
    const todosSubjects = livros.flatMap(livro => livro.subject || livro.subjects || [])
    const unicos = [...new Set(todosSubjects)]
    return unicos.filter(s => s.length < 30).slice(0, 18)
  }, [livros])

  const getImagemCategoria = (_, index) => {
    const livrosComCapa = livros.filter(l => l.cover_i)
    const livro = livrosComCapa[index % livrosComCapa.length]
    return getCoverUrl(livro?.cover_i, "S")
  }

  const irEsquerda = () => {
    const novoIndice = Math.max(0, indice - 3)
    setIndice(novoIndice)
    carrosselRef.current.scrollTo({ left: novoIndice * ITEM_WIDTH, behavior: "smooth" })
  }

  const irDireita = () => {
    const novoIndice = Math.min(categorias.length - 3, indice + 3)
    setIndice(novoIndice)
    carrosselRef.current.scrollTo({ left: novoIndice * ITEM_WIDTH, behavior: "smooth" })
  }

  if (categorias.length === 0) return null

  return (
    <div className="w-full py-4 px-6" style={{ borderTop: "1px solid var(--borda)", background: "#fff" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--texto-fraco)", fontFamily: "'Inter', sans-serif" }}>
        Categorias
      </p>

      <div className="flex items-center gap-2">
        <button onClick={irEsquerda} disabled={indice === 0}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: "1px solid var(--borda)", color: "var(--texto-medio)" }}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div ref={carrosselRef}
          className="flex gap-4 overflow-hidden scroll-smooth flex-1 scrollbar-hide">
          {categorias.map((categoria, index) => {
            const imagem = getImagemCategoria(categoria, index)
            const estaAtiva = categoriaSelecionada === categoria

            return (
              <button key={index}
                onClick={() => onSelect(estaAtiva ? null : categoria)}
                className="flex flex-col items-center gap-2 shrink-0 w-20 group">

                <div className="w-18 h-18 rounded-full overflow-hidden transition-all duration-200  hover:scale-110"
                  style={{
                    border: estaAtiva ? "2.5px solid var(--azul-medio)" : "2px solid var(--borda)",
                    boxShadow: estaAtiva ? "0 4px 14px rgba(45,95,166,0.25)" : "none",
                   
                  
                  }}>
                  {imagem ? (
                    <img src={imagem} alt={categoria} className="w-full h-full object-cover " />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "var(--azul-suave)" }}>
                      <span className="font-bold text-lg" style={{ color: "var(--azul-medio)" }}>
                        {categoria[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <span className="text-xs text-center leading-tight line-clamp-2 transition-colors"
                  style={{
                    color: estaAtiva ? "var(--azul-medio)" : "var(--texto-medio)",
                    fontWeight: estaAtiva ? 600 : 400,
                    fontFamily: "'Inter', sans-serif"
                  }}>
                  {categoria}
                </span>
              </button>
            )
          })}
        </div>

        <button onClick={irDireita} disabled={indice >= categorias.length - 3}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: "1px solid var(--borda)", color: "var(--texto-medio)" }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {categoriaSelecionada && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--texto-fraco)" }}>Filtrando por:</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: "var(--azul-medio)", background: "var(--azul-suave)", border: "1px solid var(--borda)" }}>
            {categoriaSelecionada}
          </span>
          <button onClick={() => onSelect(null)}
            className="text-xs transition-colors"
            style={{ color: "var(--texto-fraco)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#e53e3e"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--texto-fraco)"}>
            ✕ limpar
          </button>
        </div>
      )}
    </div>
  )
}