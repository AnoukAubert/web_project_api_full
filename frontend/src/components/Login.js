import React from "react";
import { Link } from "react-router-dom";

export default function Login ({ handleSubmit, confirmation = "Iniciar Sesión" }) {
  const [buttonContent, setButtonContent] = React.useState(confirmation);
  const formRef = React.useRef();
  const handlePrepareSubmit = (evt) => {
    evt.preventDefault();
    setButtonContent("Ingresando...");
    handleSubmit(getInputValues()).finally(() => {
      setButtonContent(confirmation);
     });
  };
  const getInputValues = () => {
    const inputValues = {};
    const inputList = Array.from(formRef.current.querySelectorAll("input"));
    inputList.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  };
    return (
        <>
        <div className="login">
          <h1 className="login__title">Iniciar Sesión</h1>
          <form
            className="login__form"
            noValidate
            onSubmit={handlePrepareSubmit}
            ref={formRef}
          >
            <input name="email" className="login__input" type="text" placeholder="Correo electrónico"></input>
            <input name="password" className="login__input" type="password" placeholder="Contraseña"></input>
            <button
              className="login__button"
              type="submit"
            >
            {buttonContent}
            </button>
          </form>
          <Link to="/register" className="login__foot-message">¿Aun no eres miembro? Regístrate aquí</Link>
        </div>
        </>
    )
}