import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import api from "../utils/api";
import auth from "../utils/auth";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [openPopupProfile, setOpenPopupProfile] = React.useState(false);
  const [openPopupNewPost, setOpenPopupNewPost] = React.useState(false);
  const [openPopupZoom, setOpenPopupZoom] = React.useState(false);
  const [openPopupPic, setOpenPopupPic] = React.useState(false);
  const [openPopupErase, setOpenPopupErase] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const [messageTooltip, setMessageTooltip] = React.useState("");
  const [tooltipType, setTooltipType] = React.useState("success");

  const history = useHistory();

  const closeAllPopups = () => {
    setOpenPopupErase(false);
    setOpenPopupZoom(false);
    setOpenPopupProfile(false);
    setOpenPopupNewPost(false);
    setOpenPopupPic(false);
    setOpenTooltip(false);
  };

  const handleEditAvatarClick = () => {
    setOpenPopupPic(true);
  };
  const handleEditProfileClick = () => {
    setOpenPopupProfile(true);
  };
  const handleAddPlaceClick = () => {
    setOpenPopupNewPost(true);
  };
  const handleZoomClick = (name, link) => {
    setOpenPopupZoom(true);
    setSelectedCard({
      name,
      link,
    });
  };
  const handleImageAddLike = (card) => {
    return api.addLike(card._id).then((cardResponse) => {
      card.likes = cardResponse.likes;
      setCards([...cards]);
    });
  };
  const handleImageRemoveLike = (card) => {
    return api.removeLike(card._id).then((cardResponse) => {
      card.likes = cardResponse.likes;
      setCards([...cards]);
    });
  };
  const handleImageRemove = (card) => {
    setSelectedCard(card);
    setOpenPopupErase(true);
  };

  const handleSubmitEditProfile = ({ name, about }) => {
    return api
      .updateUser(name, about)
      .then((user) => {
        setCurrentUser(user);
      })
      .then(() => {
        closeAllPopups();
      });
  };

  const removeSelectedCard = () => {
    return api
      .deleteCard(selectedCard._id)
      .then(() => {
        setCards(cards.filter((card) => card._id !== selectedCard._id));
      })
      .then(() => {
        closeAllPopups();
      });
  };

  const handleSubmitEditAvatar = ({ pic }) => {
    return api
      .updateAvatar(pic)
      .then((user) => {
        setCurrentUser(user);
      })
      .then(() => {
        closeAllPopups();
      });
  };
  const handleSubmitAddPlace = ({ title, link }) => {
    return api
      .insertCard(link, title)
      .then((card) => {
        setCards([card, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      });
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.setToken(token);
      getUserInfo(token);
    }else{
      history.push('/login')
    }
  }, []);

  const handleLogin = ({ email, password }) => {
    return auth
      .login(email, password)
      .then(({ token, message }) => {
        if (token) {
          api.setToken(token);
          localStorage.setItem("token", token);
          getUserInfo(token);          
        } else {
          setMessageTooltip(message);
          setTooltipType('error');
          setOpenTooltip(true)
          
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser({});
    setLoggedIn(false);
    history.push("/login");
  };

  const handleRegister = ({ email, password }) => {
    return auth
      .register(email, password)
      .then(({ error }) => {
        if (error) {
          setMessageTooltip(error);
          setTooltipType('error');
          setOpenTooltip(true)
        } else {
          setMessageTooltip('Se ha registrado con éxito');
          setTooltipType('success');
          setOpenTooltip(true);
          history.push('/login')
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getUserInfo = (token) => {
    auth.userInfo(token).then((user) => {
     
      setLoggedIn(true);
      api.getCards().then((cards) => {
        setCards(cards);
      });
      api.getUserInfo().then((user) => {
        setCurrentUser(user);
        history.push("/home");
      });
    });
  };

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header loggedIn={loggedIn} handleLogout={handleLogout} />
          <Switch>
            <Route path="/login">
              <Login handleSubmit={handleLogin} />
            </Route>
            <ProtectedRoute path="/home" loggedIn={loggedIn}>
              <Main
                handleEditPicClick={handleEditAvatarClick}
                handleEditProfileClick={handleEditProfileClick}
                handleNewPostClick={handleAddPlaceClick}
                handleZoomClick={handleZoomClick}
                handleImageAddLike={handleImageAddLike}
                handleImageRemove={handleImageRemove}
                handleImageRemoveLike={handleImageRemoveLike}
                cards={cards}
              />
            </ProtectedRoute>
            <Route path="/register">
              <Register handleSubmit={handleRegister} />
            </Route>
          </Switch>
          <Footer />

          <EditProfilePopup
            handleSubmit={handleSubmitEditProfile}
            open={openPopupProfile}
            close={closeAllPopups}
          />
          <AddPlacePopup
            handleSubmit={handleSubmitAddPlace}
            open={openPopupNewPost}
            close={closeAllPopups}
          />
          <ImagePopup
            selectedCard={selectedCard}
            open={openPopupZoom}
            close={closeAllPopups}
          ></ImagePopup>
          <EditAvatarPopup
            handleSubmit={handleSubmitEditAvatar}
            open={openPopupPic}
            close={closeAllPopups}
          />
          <PopupWithForm
            open={openPopupErase}
            title="¿Estás Seguro/a?"
            confirmation="Sí"
            handleSubmit={removeSelectedCard}
            activeSubmit={true}
            onClose={closeAllPopups}
          ></PopupWithForm>
          <InfoTooltip
            open={openTooltip}
            message={messageTooltip}
            type={tooltipType}
            onClose={closeAllPopups}
          />
        </div>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
