# 📚 Dear Book Collection

> **PT** — Catálogo de livros moderno integrado com a Open Library API, desenvolvido em React + Tailwind CSS.  
> **EN** — Modern book catalog integrated with the Open Library API, built with React + Tailwind CSS.

---

## 🌐 Demo / Preview

```
Busca em tempo real → Grid de livros → Carrossel de categorias → Página de detalhes
```

---

## 🇧🇷 Português

### Sobre o projeto

O **Dear Book Collection** é uma aplicação web para explorar acervos de livros usando a [Open Library API](https://openlibrary.org/developers/api) — uma base de dados pública e gratuita com milhões de títulos.

O projeto nasceu como uma refatoração de um CRUD local com JSON Server, evoluindo para uma aplicação real com dados externos, navegação por rotas e interface moderna.

---

### Funcionalidades

- 🔍 **Busca** por título, autor ou tema com resultado em tempo real
- 📖 **Grid de livros** com capas em alta resolução
- 🎠 **Carrossel de categorias** derivadas dos dados da API
- ➕ **Load More** para carregar mais livros sem trocar de página
- 📄 **Página de detalhes** com descrição, assuntos e link externo
- ⚡ **Skeleton loading** animado durante carregamentos
- 🎨 **Paleta editorial** — Azul profundo + Inter + Playfair Display

---

### Decisões técnicas

#### Por que Open Library?
A Open Library oferece busca com parâmetros `q`, `limit` e `page`, retornando capas via URL direta (`covers.openlibrary.org`). Não exige chave de API — ideal para projetos de estudo e portfólio.

#### Por que `useCallback` na função de busca?
```jsx
const carregarLivros = useCallback(async (searchQuery, resetPage = true) => {
  // ...
}, [page])
```
Sem `useCallback`, a função seria **recriada a cada render**. Como ela é passada para o `useEffect`, isso causaria um loop infinito de requisições (*cascading renders*). O `useCallback` memoriza a referência da função, estabilizando o ciclo.

#### Por que `useMemo` nas categorias e no filtro?
```jsx
const categorias = useMemo(() => {
  const todosSubjects = livros.flatMap(livro => livro.subject || [])
  return [...new Set(todosSubjects)].filter(s => s.length < 30).slice(0, 18)
}, [livros])
```
Extrair categorias únicas de um array de livros é uma operação custosa. `useMemo` guarda o resultado em cache e só recalcula quando `livros` mudar — evitando processamento desnecessário a cada render.

#### Por que `useRef` no carrossel?
```jsx
const carrosselRef = useRef(null)
carrosselRef.current.scrollTo({ left: novoIndice * ITEM_WIDTH, behavior: "smooth" })
```
Mover o scroll do carrossel é uma **operação no DOM** — não é estado. Usar `useState` para isso causaria um re-render desnecessário. O `useRef` acessa o elemento diretamente sem disparar renderizações.

#### Por que `filter` no load more ao invés de nova requisição?
```jsx
// Após excluir ou filtrar — atualiza estado local
setLivros(livrosAtuais => livrosAtuais.filter(livro => livro.id !== id))
```
Evita uma chamada extra à API. O dado já está em memória — manipulá-lo localmente é mais rápido e eficiente.

#### Por que CSS Variables no lugar de só Tailwind?
```css
:root {
  --azul-profundo: #1B3A6B;
  --azul-medio:    #2D5FA6;
}
```
CSS Variables permitem manter a paleta centralizada em um único lugar. Qualquer ajuste de cor reflete em todos os componentes automaticamente — sem precisar buscar e substituir classes Tailwind espalhadas pelo código.

---

### Estrutura do projeto

```
src/
├── components/
│   ├── BookCard.jsx          # Card individual de cada livro
│   ├── BookDetail.jsx        # Página de detalhes do livro
│   ├── BookList.jsx          # Página principal com grid e filtros
│   ├── CategoryCarousel.jsx  # Carrossel horizontal de categorias
│   └── SearchBar.jsx         # Barra de busca com ícones Lucide
├── services/
│   └── openLibraryApi.js     # Funções de comunicação com a API
├── App.jsx                   # Configuração de rotas (BrowserRouter)
├── main.jsx                  # Entrada da aplicação
└── index.css                 # Paleta global, fontes e variáveis CSS
```

---

### Fluxo de dados

```
Usuário digita busca
      ↓
searchBooks(query, page, limit)   ← openLibraryApi.js
      ↓
Open Library API
      ↓
setLivros(result.books)           ← state no BookList
      ↓
      ├── BookCard (renderiza grid)
      └── CategoryCarousel
              ↓ flatMap + Set
          categorias únicas
              ↓ onClick
          setCategoriaAtiva
              ↓ useMemo (filter)
          livrosFiltrados → atualiza grid
```

---

### Hooks utilizados e suas funções

| Hook | Onde | Por quê |
|---|---|---|
| `useState` | BookList, CategoryCarousel | Gerenciar livros, página, loading, categoria ativa |
| `useEffect` | BookList, BookDetail | Disparar busca na montagem do componente |
| `useCallback` | BookList | Estabilizar função assíncrona para evitar loop no useEffect |
| `useMemo` | BookList, CategoryCarousel | Cache de operações custosas (filtro, categorias) |
| `useRef` | CategoryCarousel | Controlar scroll do DOM sem causar re-render |

---

### Instalação

```bash
# Clone o repositório
git clone https://github.com/carlosfonseca84/library-colection-api-react-tailwind.git
cd nome-da-pasta

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

---

### Dependências principais

| Pacote | Versão | Função |
|---|---|---|
| `react` | ^19 | Biblioteca de UI |
| `react-router-dom` | ^7 | Navegação entre páginas |
| `axios` | ^1 | Requisições HTTP |
| `lucide-react` | ^0.383 | Ícones SVG |
| `tailwindcss` | ^4 | Estilização utilitária |

---

### API utilizada

**Open Library** — [openlibrary.org/developers](https://openlibrary.org/developers/api)

```
# Busca com paginação
GET https://openlibrary.org/search.json?q={query}&page={page}&limit={limit}

# Detalhes de um livro
GET https://openlibrary.org/works/{id}.json

# Capa do livro
GET https://covers.openlibrary.org/b/id/{cover_id}-{S|M|L}.jpg
```

---

**Desenvolvido por Carlos Fonseca** -(https://github.com/carlosfonseca84/library-colection-api-react-tailwind.git)

---

## 🇺🇸 English

### About

**Dear Book Collection** is a modern web application for exploring book catalogs using the [Open Library API](https://openlibrary.org/developers/api) — a free, public database with millions of titles.

The project started as a refactor of a local CRUD with JSON Server, evolving into a real application with external data, client-side routing, and a modern interface.

---

### Features

- 🔍 **Search** by title, author, or subject in real time
- 📖 **Book grid** with high-resolution covers
- 🎠 **Category carousel** derived from API data
- ➕ **Load More** to fetch additional books without page reload
- 📄 **Detail page** with description, subjects and external link
- ⚡ **Animated skeleton loading** during fetch operations
- 🎨 **Editorial palette** — Deep blue + Inter + Playfair Display

---

### Technical Decisions

#### Why Open Library?
Open Library supports search with `q`, `limit`, and `page` parameters, and serves cover images via direct URL (`covers.openlibrary.org`). No API key required — perfect for study and portfolio projects.

#### Why `useCallback` on the fetch function?
Without `useCallback`, the function is **recreated on every render**. Since it's used inside `useEffect`, this would cause an infinite loop of requests (*cascading renders*). `useCallback` memoizes the function reference, stabilizing the effect cycle.

#### Why `useMemo` for categories and filtering?
Extracting unique categories from an array of books is an expensive operation. `useMemo` caches the result and only recalculates when `livros` changes — avoiding unnecessary processing on every render.

#### Why `useRef` in the carousel?
Scrolling the carousel is a **DOM operation** — not state. Using `useState` for this would trigger unnecessary re-renders. `useRef` accesses the element directly without firing renders.

#### Why CSS Variables alongside Tailwind?
CSS Variables centralize the color palette in one place. Any color change reflects across all components automatically — no need to search and replace Tailwind classes throughout the codebase.

---

### Data Flow

```
User types search
      ↓
searchBooks(query, page, limit)   ← openLibraryApi.js
      ↓
Open Library API
      ↓
setLivros(result.books)           ← BookList state
      ↓
      ├── BookCard (renders grid)
      └── CategoryCarousel
              ↓ flatMap + Set
          unique categories
              ↓ onClick
          setCategoriaAtiva
              ↓ useMemo (filter)
          filtered books → updates grid
```

---

### Hooks Reference

| Hook | Where | Why |
|---|---|---|
| `useState` | BookList, CategoryCarousel | Manage books, page, loading, active category |
| `useEffect` | BookList, BookDetail | Trigger fetch on component mount |
| `useCallback` | BookList | Stabilize async function to prevent useEffect loop |
| `useMemo` | BookList, CategoryCarousel | Cache expensive operations (filter, categories) |
| `useRef` | CategoryCarousel | Control DOM scroll without triggering re-renders |

---

### Installation

```bash
# Clone the repository
git clone https://github.com/carlosfonseca84/library-colection-api-react-tailwind.git
cd name-file

# Install dependencies
npm install

# Start development server
npm run dev
```

---

### API Reference

**Open Library** — [openlibrary.org/developers](https://openlibrary.org/developers/api)

```
# Search with pagination
GET https://openlibrary.org/search.json?q={query}&page={page}&limit={limit}

# Book details
GET https://openlibrary.org/works/{id}.json

# Book cover
GET https://covers.openlibrary.org/b/id/{cover_id}-{S|M|L}.jpg
```

---

**Developed by Carlos Fonseca** - (https://github.com/carlosfonseca84/library-colection-api-react-tailwind.git)*
