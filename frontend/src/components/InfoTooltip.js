import Popup from "./Popup";
import successImage from "../images/success.png";
import errorImage from "../images/fail.png";

export default function InfoTooltip({ open, onClose, message, type }) {
  return (
    <>
      <Popup open={open}>
        <div className="popup__container">
        <button className="popup__close-btn" onClick={onClose}></button>
          <img
            src={
              type === "success" ? successImage : errorImage
            }
            className="popup__icon"
            alt="Message"
          />
          <p className="popup__message">{message}</p>
        </div>
      </Popup>
    </>
  );
}