import styles from './login.module.css'
import { FaHelmetSafety } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

export default function Login () {
    return(
        <div className={styles.loginContainer}>
            <div className={styles.loginBoxProvider}>
                <h3><FaHelmetSafety />Sou Profissional</h3>
            </div>

            <div className={styles.loginBoxUser}>
                <h3> <FaUserAlt />Sou Usuario</h3>
            </div>
        </div>
    )
}