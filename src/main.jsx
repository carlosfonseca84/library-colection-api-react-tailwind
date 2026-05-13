import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'



//IMPORTANTE: O código abaixo é o ponto de entrada da aplicação. Ele renderiza o componente App dentro do elemento com id 'root' no HTML.




createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <App />
  </StrictMode>,
)
