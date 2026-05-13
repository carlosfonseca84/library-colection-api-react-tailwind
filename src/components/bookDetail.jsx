import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookDetail, getCoverUrl } from "../services/openLibraryApi";

export default function BookDetail() {
  const { id } = useParams();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscar = async () => {
      try {
        setCarregando(true);
        const data = await getBookDetail(id);
        setLivro(data);
      } catch {
        setErro("Não foi possível carregar os detalhes deste livro.");
      } finally {
        setCarregando(false);
      }
    };
    buscar();
  }, [id]);

  if (carregando) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-slate-400 text-sm">Carregando detalhes...</p>
      </div>
    </div>
  );

  if (erro) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">{erro}</p>
        <Link to="/" className="text-blue-500 underline text-sm">Voltar ao catálogo</Link>
      </div>
    </div>
  );

  const coverId = livro?.covers?.[0];
  const coverUrl = getCoverUrl(coverId, "L");
  const descricao = typeof livro?.description === "string"
    ? livro.description
    : livro?.description?.value || "Sem descrição disponível.";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Voltar */}
        <Link to="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-500 text-sm mb-8 transition-colors">
          ← Voltar ao catálogo
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-0">

            {/* Capa */}
            <div className="md:w-64 shrink-0 bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8 md:p-10">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={livro?.title}
                  className="rounded-xl shadow-lg max-h-80 object-cover"
                />
              ) : (
                <div className="w-40 h-56 bg-slate-200 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">📖</span>
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 p-8 flex flex-col gap-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 leading-tight">{livro?.title}</h1>
                {livro?.subtitle && (
                  <p className="text-slate-400 mt-1 text-sm">{livro.subtitle}</p>
                )}
              </div>

              {/* Tags de assuntos */}
              {livro?.subjects?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {livro.subjects.slice(0, 5).map((s, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Descrição */}
              <div>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Descrição</h2>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-6">{descricao}</p>
              </div>

              {/* Link externo */}
              <a
                href={`https://openlibrary.org/works/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-blue-600 border border-blue-200 rounded-xl px-4 py-2 w-fit hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                Ver na Open Library ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
