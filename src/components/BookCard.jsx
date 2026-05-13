import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"
import { getCoverUrl } from "../services/openLibraryApi"

export default function BookCard({ book }) {
  const coverUrl = getCoverUrl(book.cover_i, "L")
  const workId   = book.key?.replace("/works/", "")
  const title    = book.title || "Título desconhecido"
  const author   = book.author_name?.[0] || "Autor desconhecido"
  const year     = book.first_publish_year || "—"

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
      style={{ border: "1px solid var(--borda)" }}>

      {/* Capa */}
      <div className="relative h-64 overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--azul-suave), #E8EFF9)" }}>

        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
            <BookOpen strokeWidth={1} style={{ width: 48, height: 48, color: "var(--azul-claro)" }} />
            <span className="text-xs text-center font-medium line-clamp-2"
              style={{ color: "var(--texto-medio)" }}>{title}</span>
          </div>
        )}

        <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
          style={{ background: "rgba(255,255,255,0.92)", color: "var(--azul-profundo)", backdropFilter: "blur(4px)" }}>
          {year}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-editorial font-semibold text-sm leading-snug line-clamp-2"
            style={{ color: "var(--texto-forte)" }}>{title}</h3>
          <p className="text-xs mt-1 font-medium truncate"
            style={{ color: "var(--texto-fraco)" }}>{author}</p>
        </div>

        {workId && (
          <Link to={`/detalhes/${workId}`}
            className="w-full text-center text-xs font-semibold rounded-xl py-2 px-3 transition-all duration-200"
            style={{ color: "var(--azul-medio)", border: "1px solid var(--borda)", background: "var(--fundo)" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--azul-medio)"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.border = "1px solid var(--azul-medio)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--fundo)"
              e.currentTarget.style.color = "var(--azul-medio)"
              e.currentTarget.style.border = "1px solid var(--borda)"
            }}>
            Ver detalhes →
          </Link>
        )}
      </div>
    </div>
  )
}