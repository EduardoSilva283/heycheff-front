import { useState } from 'react';

import styles from './formLogin.module.css';

function FormLogin() {
    const [isActive, setIsActive] = useState(true);

    const changeForm = () => {
        setIsActive(!isActive);
    }

    return (
        <div className={styles.body}>
            <section className={styles.formsSection}>
                <div className={styles.forms}>
                    <div className={`${styles.formWrapper} ${isActive ? styles.active : ''}`}>
                        <button type="button" className={`${styles.switcher} ${styles.switcherLogin}`} onClick={changeForm}>
                            Login
                            <span className={styles.underline}></span>
                        </button>
                        <form className={`${styles.form} ${styles.formLogin}`}>
                            <fieldset>
                                <legend>Please, enter your username and password for login.</legend>
                                <div className={styles.inputBlock}>
                                    <label htmlFor="login-username">Username</label>
                                    <input id="login-username" type="text" required />
                                </div>
                                <div className={styles.inputBlock}>
                                    <label htmlFor="login-password">Password</label>
                                    <input id="login-password" type="password" required />
                                </div>
                            </fieldset>
                            <button type="submit" className={styles.btnLogin}>Login</button>
                        </form>
                    </div>
                    <div className={`${styles.formWrapper} ${!isActive ? styles.active : ''}`}>
                        <button type="button" className={`${styles.switcher} ${styles.switcherSignup}`} onClick={changeForm}>
                            Sign Up
                            <span className={styles.underline}></span>
                        </button>
                        <form className={`${styles.form} ${styles.formSignup}`}>
                            <fieldset>
                                <legend>Please, enter your e-mail, username and password for sign up.</legend>
                                <div className={styles.inputBlock}>
                                    <label htmlFor="signup-email">E-mail</label>
                                    <input id="signup-email" type="email" required />
                                </div>
                                <div className={styles.inputBlock}>
                                    <label htmlFor="signup-username">Username</label>
                                    <input id="signup-username" type="text" required />
                                </div>
                                <div className={styles.inputBlock}>
                                    <label htmlFor="signup-password">Password</label>
                                    <input id="signup-password" type="password" required />
                                </div>
                            </fieldset>
                            <button type="submit" className={styles.btnSignup}>Continue</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FormLogin;