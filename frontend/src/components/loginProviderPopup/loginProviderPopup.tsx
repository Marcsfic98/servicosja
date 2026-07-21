import { Dialog } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { IoExitOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import Loading2 from '../../pages/loading/loading2';
import styles from './loginUserPopup.module.css';

interface LoginProviderPopupProps {
  open: boolean;
  close: () => void;
}

interface ProviderLoginState {
  email: string;
  password: string;
}

export default function LoginProviderPopup({
  open,
  close,
}: LoginProviderPopupProps) {
  const navigate = useNavigate();
  const [providerLogin, setProviderLogin] = useState<ProviderLoginState>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticating } = useAuth();

  const handleChangeLogin = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newValue = name === 'email' ? value.toLowerCase() : value;

    setProviderLogin((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login({
        email: providerLogin.email,
        password: providerLogin.password,
      });

      close();

      if (result.tipo_usuario === 'prestador') {
        navigate('/providerPerfil');
      } else {
        navigate('/userPerfil');
      }
    } catch (err) {
      console.error('Erro de login:', err);

      if (typeof err === 'object' && err !== null && 'detail' in err) {
        const detail = (err as { detail?: unknown }).detail;
        setError(
          typeof detail === 'string'
            ? detail
            : 'Falha no login. Verifique suas credenciais.',
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Falha no login. Verifique suas credenciais.');
      }
    }
  };

  return (
    <>
      <Dialog className={styles.popupContainer} onClose={close} open={open}>
        <div className={styles.popup}>
          <div className={styles.popupMenu}>
            <img src="/img/logo/logo.png" alt="Logo serviços já" />

            <div onClick={close} className={styles.exitIcon}>
              <IoExitOutline />
            </div>
          </div>

          <div className={styles.popupBody}>
            {isAuthenticating ? (
              <Loading2 />
            ) : (
              <>
                <h3>Acesse Sua Conta</h3>
                <p>Entre com email e senha para ter acesso a sua conta</p>

                <form onSubmit={handleSubmit}>
                  <input
                    onChange={handleChangeLogin}
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <input
                    onChange={handleChangeLogin}
                    name="password"
                    type="password"
                    placeholder="Senha"
                    required
                  />

                  {error && (
                    <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>
                  )}

                  <button type="submit">Entrar</button>

                  <a href="#">Esqueceu a senha?</a>
                </form>
              </>
            )}
          </div>

          <div className={styles.popupFooter}>
            <button onClick={() => navigate('/providerRegistration')}>
              Não Tem Uma Conta? Cadastre-se
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
