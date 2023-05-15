import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import * as auth from '../utils/Auth.js';
import InfoTooltip from './InfoTooltip.jsx';

// Будем использовать управляемые элементы
function Register(props) {
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  })

  function closePopup() {
    setIsInfoTooltipPopupOpen(false);
  }

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.register (
      formValue.email,
      formValue.password,
    )
    .then((res) => {
      if (res.data) {
        console.log(res)
        setFormValue({ email: '', password: '' });
        setIsInfoTooltipPopupOpen(true);
        setIsRegister(true)
      } else {
        setIsInfoTooltipPopupOpen(true);
        setIsRegister(false)
      }
    })
    .catch(err => console.log(err))
  }

  return (
    <>
      <div className="entry">
        <h2 className="entry__title">Регистрация</h2>
        <form className="entry__form" onSubmit={handleSubmit}>
          <input
            className="entry__input"
            required
            id="email"
            name="email"
            type="email"
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
            className="entry__button"
            type="submit"
            onSubmit={handleSubmit}
          >
            Зарегистрироваться
          </button>
        </form>
        <Link to="/sign-in" className="entry__link">
          Уже зарегистрированы? Войти
        </Link>
      </div>
      <InfoTooltip
        name={'info-tooltip'}
        isOpen={isInfoTooltipPopupOpen}
        isRegister={isRegister}
        onClose={closePopup}
      />
    </>
  );
}

export default Register;
