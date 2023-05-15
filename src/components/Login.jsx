import React, { useState } from 'react';
import * as auth from '../utils/Auth.js';
import { useNavigate } from 'react-router-dom';

function Login(props) {

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!formValue.email || !formValue.password) {
    //   return;
    // }
    auth
      .authorize(formValue.email, formValue.password)
      .then((data) => {
        console.log(data);
        // проверить, есть ли у данных JWT
        if (data){
          // сбросить стейт, затем в колбэке установить
          // стейт loggedIn родительского App как true,
          // затем перенаправьте его в основной контент
          setFormValue({email: '', password: ''});
          props.handleLogin();
          navigate('/', {replace: true});
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="entry">
      <h2 className="entry__title">Вход</h2>
      <form className="entry__form" onSubmit={handleSubmit}>
        <input
          className="entry__input"
          required
          id="email"
          name="email"
          type="text"
          placeholder="Email"
          value={formValue.email}
          onChange={handleChange}
        />
        <input
          className="entry__input"
          required
          id="password"
          name="password"
          type="password"
          placeholder="Пароль"
          value={formValue.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="entry__button"
        >
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
