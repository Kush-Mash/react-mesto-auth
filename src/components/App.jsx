import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import { api } from "../utils/Api.js";
import * as auth from "../utils/Auth.js"
import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import ImagePopup from "./ImagePopup.jsx";
import EditProfilePopup from "./EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup.jsx";
import ConfirmationPopup from "./ConfirmationPopup.jsx";
import InfoTooltip from "./InfoTooltip.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const navigate = useNavigate();
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [removedCardId, setRemovedCardId] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    Promise.all([api.getCurrentUser(), api.getServerCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleTrashClick(card) {
    setIsConfirmationPopupOpen(!isConfirmationPopupOpen);
    setRemovedCardId(card);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card)
      .then(() => {
        // обновить стейт cards с помощью метода filter:
        // создать копию массива, исключив из него удалённую карточку
        setCards((cards) => cards.filter((i) => i._id !== card));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(newUserInfo) {
    api
      .updateUserInfo(newUserInfo)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(items) {
    api
      .updateAvatar(items)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(items) {
    api
      .postNewCard(items)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleLogin = () => {
    setLoggedIn(true);
  }

  function signOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setEmail('');
    navigate('/sign-in', { replace: true });
  }

  useEffect(() => {
    tokenCheck();
  }, [])

  const tokenCheck = () => {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит, действующий он или нет
    const jwt = localStorage.getItem('jwt');
    if (jwt){
      // проверим токен
      auth.checkToken(jwt)
        .then((res) => {
          // авторизуем пользователя
          console.log(res);
          setLoggedIn(true);
          setEmail(res.data.email);
          navigate('/', {replace: true});
        })
        .catch(err => console.log(err))
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    auth
      .register (
        formValue.email,
        formValue.password,
      )
      .then(() => {
        // setFormValue({ email: '', password: '' });
        console.log(formValue);
        setIsInfoTooltipPopupOpen(true);
        setIsRegister(true);
        navigate('/sign-in', {replace: true});
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
        setIsInfoTooltipPopupOpen(true);
        setIsRegister(false)
      })
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    auth
      .authorize (
        formValue.email,
        formValue.password
      )
      .then((data) => {
        if (data){
          setFormValue({email: '', password: ''});
          handleLogin();
          navigate('/', {replace: true});
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={signOut} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
              element={Main}
              loggedIn={loggedIn}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleTrashClick}
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Login
                handleLogin={handleLogin}
                handleLoginSubmit={handleLoginSubmit}
                handleChange={handleChange}
                formValue={formValue}
              />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
              handleRegisterSubmit={handleRegisterSubmit}
              handleChange={handleChange}
              formValue={formValue}
              />
            }
          />
          <Route path="*" element={<Navigate to={loggedIn ? "/" : "/sign-in"} replace />} />
        </Routes>
        {loggedIn && <Footer />}

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ConfirmationPopup
          isOpen={isConfirmationPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
          card={removedCardId}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          name={"info-tooltip"}
          isOpen={isInfoTooltipPopupOpen}
          isRegister={isRegister}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
