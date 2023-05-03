import React from 'react';
import logo from '../images/header-logo.svg';

function Header() {
  return (
    <header className="header">
      <img className="header__logo" alt="Логотип Место" src={logo}/>
    </header>
  );
};

export default Header;