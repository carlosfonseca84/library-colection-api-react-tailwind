import { Link } from "react-router-dom";

export default function Home() {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark ">
			<div className="container">
				<Link className="navbar-brand" to="/">
					Catalogo de Livros
				</Link>

				<div className=" navbar-nav">
					<Link className="nav-link" to="/">
						Lista de Livros
					</Link>
					<Link className="nav-link" to="/novo">
						Adicionar Livros
					</Link>
				</div>
			</div>
		</nav>
	);
}
