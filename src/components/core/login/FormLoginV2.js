import { faApple, faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { redirect } from 'react-router-dom';
import { authenticate, register } from '../../../service/auth';
import CustomToast from '../../shared/toast/CustomToast';
import styles from './formLoginV2.module.css';

function FormLoginV2() {
    const [isActive, setIsActive] = useState(false);
    const [signupToast, setSignupToast] = useState(false);
    const [login, setLogin] = useState({ username: "", password: "" });
    const [signup, setSignup] = useState({ email: "", username: "", password: "" });

    const changeForm = (bool) => {
        setIsActive(bool);
    }

    const handleLogin = (field) => {
        setLogin(prev => ({ ...prev, [field.target.name]: field.target.value }));
    }

    const handleSignup = (field) => {
        setSignup(prev => ({ ...prev, [field.target.name]: field.target.value }));
    }

    const doAuthenticate = async () => {
        await authenticate(login.username, login.password)
            .then(resp => {
                if (resp.status === 200) redirect("/");
            });
    }

    const doRegister = async () => {
        await register(signup.email, signup.username, signup.password)
            .then(resp => {
                if (resp.status === 201) {
                    setSignupToast(true);
                    changeForm(true);
                }
            });
    }

    return (
        <div className={styles.body}>
            <CustomToast
                show={signupToast}
                onClose={() => setSignupToast(false)}
                type="success"
                message="Usuário cadastrado com sucesso" />

            <div className={`${styles.container} ${isActive ? styles.active : ''}`} id="container">
                <div className={`${styles.formContainer} ${styles.signUp}`}>
                    <form>
                        <h1>Criar a sua conta!</h1>
                        <div className={styles.iconeSocial}>
                            <div><FontAwesomeIcon icon={faGoogle} /></div>
                            <div><FontAwesomeIcon icon={faGithub} /></div>
                            <div><FontAwesomeIcon icon={faApple} /></div>
                            <div><FontAwesomeIcon icon={faFacebook} /></div>
                        </div>
                        <span>Ou use seu E-mail e crie uma nova senha</span>
                        <input required type="email" placeholder="E-mail" name="email"
                            onChange={email => handleSignup(email)} />
                        <input required type="text" placeholder="Username" name="username"
                            onChange={username => handleSignup(username)} />
                        <input required type="password" placeholder="Senha" name="password"
                            onChange={password => handleSignup(password)} />
                        <a href="#"><u>Esqueceu sua senha?</u></a>
                        <button className={styles.escondido} onClick={doRegister}>Cadastrar</button>
                    </form>
                </div>
                <div className={`${styles.formContainer} ${styles.signIn}`}>
                    <form>
                        <h1>Entre na sua conta!</h1>
                        <div className={styles.iconeSocial}>
                            <div><FontAwesomeIcon icon={faGoogle} /></div>
                            <div><FontAwesomeIcon icon={faGithub} /></div>
                            <div><FontAwesomeIcon icon={faApple} /></div>
                            <div><FontAwesomeIcon icon={faFacebook} /></div>
                        </div>
                        <span>Ou use seu E-mail e entre com sua senha</span>
                        <input required type="text" placeholder="Username" name="username"
                            onChange={username => handleLogin(username)} />
                        <input required type="password" placeholder="Senha" name="password"
                            onChange={password => handleLogin(password)} />
                        <a href="#"><u>Esqueceu sua senha?</u></a>
                        <button className={styles.cadastro} onClick={doAuthenticate}>Entrar</button>
                    </form>
                </div>
                <div className={styles.painelContainer}>
                    <div className={styles.painel}>
                        <div className={`${styles.posicaoPainel} ${styles.painelEsquerda}`}>
                            <ul>
                                <h1>Acesse o HeyCheff caso já tenha uma conta!</h1>
                                <p>Insira os seus dados para acessar novamente as funcionalidades do site ou clique no botão abaixo para efetuar o cadastro!</p>
                                <button className={styles.escondido} id="loginbtn" onClick={() => changeForm(false)}>Entrar</button>
                            </ul>
                        </div>
                        <div className={`${styles.posicaoPainel} ${styles.painelDireita}`}><ul>
                            <h1>Olá, Bem-Vindo ao HeyCheff</h1>
                            <p>Por favor registre os seus dados básicos para começar a utilizar algumas funções do site ou clique no botão abaixo se já for um Cheff!</p>
                            <button className={styles.cadastro} id="cadastrobtn" onClick={() => changeForm(true)}>Cadastrar</button>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormLoginV2;