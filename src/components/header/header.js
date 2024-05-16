import './header.css'
import logo from 'c:/sys/HeyCheff/heycheff-front/src/assets/hey_cheff_black.png';

//heycheff-front/src/

function Header(){
    return(
        <nav class="navbar bg-body-tertiary">

        <div class="navbar">
            <div class="nav-logo">
		        <img src={logo} alt="Logo HeyCheff"/>
	        </div>

            <input class="nav-search nav-item" placeholder="Pesquise Aqui..."/>
            
            <div class="nav-item">
                <button class="btn btn-outline-dark" type="submit">Cadastrar Receita</button>
            </div>
        </div>
        </nav>


    )
}
export default Header;