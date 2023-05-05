import React from 'react';
import logo from '../images/header-logo.svg';

function Header() {
  return (
    <header className="header">
      <img className="header__logo" alt="Логотип Место" src={logo}/>
      <link className="header__link" src="#"/>
    </header>
  );
};

export default Header;
