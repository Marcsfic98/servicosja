import {Link} from 'react-router-dom'
import styles from './navbar.module.css'

export default function Navbar () {
    return (
        <nav className={styles.navbarContainer}>
            <img src="/img/logo/logo.png" alt="logo Serviçosjá"/>

            <div className={styles.navLinkContainer}>
                <Link className={styles.navLink} to={'/home'}>Inicio</Link>
                <Link className={styles.navLink} to={'/services'}>Serviços</Link>
                <Link className={styles.navLink} to={'/'}>Sobre nós</Link>
                <Link className={styles.navLink} to={'/'}>Planos</Link>
            </div>

            <button>Sou prestador de serviços</button>
        </nav>
    )
}