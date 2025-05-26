import React from "react";
import logo from "../images/logo.svg";

export default function Header({loggedIn, handleLogout}) {
  return (
    <div>
      <header className="header">
        <img className="header__logo" alt="logo Around The US" src={logo} />
        {loggedIn  && <a className="header__status" href="#" onClick={handleLogout}>Cerrar sesión </a>}
      </header>
    </div>
  );
}
