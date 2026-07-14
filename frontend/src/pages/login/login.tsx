import { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { FaHelmetSafety } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import LoginProviderPopup from '../../components/loginProviderPopup/loginProviderPopup';
import LoginUserPopup from '../../components/loginUserPopup/loginUserPopup';
import { useAuth } from '../../context/AuthContext';
import styles from './login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [isProviderPopupOpen, setIsProviderPopupOpen] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const userType =
      user.tipo_usuario === 'prestador' ? 'providerPerfil' : 'userPerfil';
    navigate(`/${userType}`);
    return null;
  }

  const handleOpenUserLogin = () => setIsUserPopupOpen(true);
  const handleCloseUserLogin = () => setIsUserPopupOpen(false);

  const handleOpenProviderLogin = () => setIsProviderPopupOpen(true);
  const handleCloseProviderLogin = () => setIsProviderPopupOpen(false);

  return (
    <div className={styles.loginContainer}>
      <div
        onClick={handleOpenProviderLogin}
        className={styles.loginBoxProvider}
        role="button"
        tabIndex={0}
      >
        <h3>
          <FaHelmetSafety />
          Profissional
        </h3>
      </div>

      <div
        onClick={handleOpenUserLogin}
        className={styles.loginBoxUser}
        role="button"
        tabIndex={0}
      >
        <h3>
          <FaUserAlt />
          Cliente
        </h3>
      </div>

      <LoginUserPopup close={handleCloseUserLogin} open={isUserPopupOpen} />
      <LoginProviderPopup
        close={handleCloseProviderLogin}
        open={isProviderPopupOpen}
      />
    </div>
  );
}
