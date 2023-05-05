import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="entry">
      <h2 className="entry__title">Регистрация</h2>
      <form className="entry__form">
        <input
        className="entry__input"
          required
          id="username"
          name="username"
          type="text"
          placeholder="Email"
        />
        <input
        className="entry__input"
          required
          id="password"
          name="password"
          type="password"
          placeholder="Пароль"
        />
        <button type="submit" className="entry__button">
          Зарегистрироваться
        </button>
      </form>
      <Link to="/sign-in" className="entry__link">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  );
}

export default Register;
