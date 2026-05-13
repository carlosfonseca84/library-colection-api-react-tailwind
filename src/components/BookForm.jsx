        import { useState, useEffect } from "react"
        import { useNavigate, useParams,Link } from "react-router-dom"
        import api from "../services/api"

        
        
        
        export default function  BookForm() {
           
              // variáveis de estado para armazenar os dados do formulário
                const [titulo, setTitulo] = useState('')
                const [paginas, setPaginas] = useState('')
                const [categoria, setCategoria] = useState('ficção')
                const [descricao, setDescricao] = useState('')

               const {id} = useParams()// para obter o id do livro a ser editado
                const navigate = useNavigate(); // para navegar entre as páginas//

              useEffect(() => {  
                if(id) { // se houver um id, significa que estamos editando um livro existente   
                    api.get(`/${id}`).then(res => { // faz uma requisição GET para obter os dados do livro
                        const livro = res.data
                        setTitulo(livro.titulo) // preenche os campos do formulário com os dados do livro
                        setPaginas(livro.paginas)
                        setCategoria(livro.categoria)
                        setDescricao(livro.descricao)
                    })
                    .catch(err => {
                      console.error("Erro ao obter o livro:", err)
                      alert("Erro ao obter o livro. Por favor, tente novamente.")
                    })
                }
                     }, [id]) // o useEffect depende do id, ou seja, ele será executado sempre que o id mudar
               const salvarLivro = async (e) => {
                  e.preventDefault() // para evitar o comportamento padrão do formulário
                  const dados = {titulo, paginas, categoria, descricao} // objeto com os dados do livro

                  if(id) {
                    // se houver um id, significa que estamos editando um livro existente
                    await api.put(`/${id}`, dados) // envia uma requisição PUT para atualizar o livro
                  }else {
                    // se não houver um id, significa que estamos criando um novo livro
                    await api.post('/', dados) // envia uma requisição POST para criar um novo livro
               }
                  navigate('/') // após salvar, navega de volta para a página inicial
              }

                 return (
               <div className="container card p-0 mt-5" style={{maxWidth: "50rem"}}> 
                    <div className="card-header">
                        <h5>{id ? "Editar Livro" : "Novo Livro"}</h5>
                    </div>
                    <div className="card-body">

                        <form>
                            <div className="mb-3">
                                <label className="form-label">Título</label>
                                <input type="text" className="form-control" value={titulo} onChange={e => setTitulo(e.target.value)}
                                required />
               </div>

               <div className="row mb-3">
                <div className="col-md-6">   
                 <label className="form-label">Páginas</label>
                    <input type="number" className="form-control" value={paginas} onChange={e => setPaginas(e.target.value)}
                    required />   
                     </div>

                     <div  className="col-md-6"> 
                     <label className="form-label">Categoria</label>
                     <select className="form-select" value={categoria} onChange={e => setCategoria(e.target.value)}>
                        <option value="ficção">Ficção</option>
                        <option value="não ficção">Romance</option>
                        <option value="biografia">Biografia</option>
                     </select>

                     </div>
                   </div>

                   <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-control" value={descricao} onChange={e => setDescricao(e.target.value)}></textarea>

                   </div>

                   <button type="submit" className="btn btn-success" onClick={salvarLivro}>Salvar</button>
                   <Link  className="btn btn-warning ms-2"  to={"/"}>Voltar</Link>
                   
            </form>
            </div>
        </div>
        )
}