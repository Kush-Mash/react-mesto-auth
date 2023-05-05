function Login() {
  return (
    <div className="entry">
      <h2 className="entry__title">Вход</h2>
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
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
