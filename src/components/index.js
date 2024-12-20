import '../pages/index.css';

import { openModal, closeModal } from './modal.js';
import { createCard, updateLikeCount } from './card.js';
import { enableValidation } from './validate.js';
import {
    fetchUserData, 
    fetchCards, 
    updateProfile,
    addCard,
    deleteCard,
    toggleLikeCard,
    updateAvatar
} from './api.js';

// Профиль

function handleProfileFormSubmit(event) {
    event.preventDefault();

    const body = {
        name: profileNameInput.value,
        about: profileTextInput.value,
    }

    closeProfileButton.textContent = "Сохранение...";

    updateProfile(body)
        .then(user => {
            userName.textContent = user.name;
            userText.textContent = user.about;
        })
        .finally(() => {
            closeProfileButton.textContent = "Сохранить";
            closeModal(profilePopup);
        });
}

const userName = document.querySelector('.profile__title');
const userText = document.querySelector('.profile__description');
const userPfp = document.querySelector('.profile__image');

const profilePicPopup = document.querySelector('.popup_type_avatar');
const pfpFormElement = profilePicPopup.querySelector('.popup__form');
const pfpFormButton = pfpFormElement.querySelector('.popup__button');
const pfpLinkInput = pfpFormElement.querySelector('.popup__input_type_url');

const editProfileButton = document.querySelector('.profile__edit-button');

const profilePopup = document.querySelector('.popup_type_edit');

const profileFrom = profilePopup.querySelector('.popup__form');

const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
const profileTextInput = profilePopup.querySelector('.popup__input_type_description');
const closeProfileButton = profilePopup.querySelector('.popup__close');


editProfileButton.addEventListener('click', () => {
    profileNameInput.value = userName.textContent;
    profileTextInput.value = userText.textContent;
    openModal(profilePopup)
});

closeProfileButton.addEventListener('click', () => closeModal(profilePopup));

profileFrom.addEventListener('submit', handleProfileFormSubmit);



// Изображение

const imagePopup = document.querySelector('.popup_type_image');

const imageImage = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');
const closeImageButton = imagePopup.querySelector('.popup__close');

closeImageButton.addEventListener('click', () => closeModal(imagePopup));

const cardsList = document.querySelector('.places__list');

function handleCardFormSubmit(event) {
    event.preventDefault();

    cardFormButton.textContent = "Создание...";

    const body = {
        name: cardNameInput.value,
        link: cardLinkInput.value
    };

    addCard(body)
        .then(card => {
            const newCard = createCard(card.name, card.link, card.likes.length, card._id);
            cardsList.prepend(newCard);
        })
        .finally(() => {
            cardFormButton.textContent = "Сохранить";
            closeModal(cardPopup);
        });
}

const addCardButton = document.querySelector('.profile__add-button');

const cardPopup = document.querySelector('.popup_type_new-card');

const cardForm = cardPopup.querySelector('.popup__form');
const cardFormButton = cardForm.querySelector('.popup__button');
const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');
const closeCardButton = cardPopup.querySelector('.popup__close');


addCardButton.addEventListener('click', () => {
    cardNameInput.value = '';
    cardLinkInput.value = '';
    openModal(cardPopup)
});

closeCardButton.addEventListener('click', () => closeModal(cardPopup));

cardForm.addEventListener('submit', handleCardFormSubmit);


cardsList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('card__image')) {
        imageImage.src = '';
        imageImage.src = target.src;
        imageCaption.textContent = target.alt;
        openModal(imagePopup);
    } else if (target.classList.contains('card__like-button')) {
        target.disabled = true;
        const item = target.closest('.places__item');
        const method = target.classList.contains('card__like-button_is-active') ? "DELETE" : "PUT";
        toggleLikeCard(item.id, method)
            .then(card => {
                const newCard = updateLikeCount(item, card.likes.length);
                item.replaceWith(newCard);
                target.classList.toggle('card__like-button_is-active');
            })
            .finally(() => {
                target.disabled = false;
            });
    } else if (target.classList.contains('card__delete-button')) {
        target.disabled = true;
        const item = event.target.closest('.places__item');
        deleteCard(item.id).then(_ => item.remove());
    }
});


// Загрузка страницы
Promise.all([fetchUserData(), fetchCards()])
    .then(([user, cards]) => {
        userName.textContent = user.name;
        userText.textContent = user.about;
        userPfp.style.backgroundImage = `url(${user.avatar})`;
        const userId = user._id;

        cards.forEach(cardJson => {
            const card = createCard(cardJson.name, cardJson.link, cardJson.likes.length, cardJson._id);
            if (cardJson.likes.some(user => userId === user._id)) {
                card.querySelector('.card__like-button').classList.add('card__like-button_is-active');
            }
            if (cardJson.owner._id !== userId) {
                card.querySelector('.card__delete-button').classList.add('card__delete-button_deactivate');
            }
            cardsList.append(card);
        })
    });


function handleProfilePictureFormSubmit(event) {
    event.preventDefault();

    pfpFormButton.textContent = "Сохранение...";
    
    const body = {
        avatar: pfpLinkInput.value
    };

    updateAvatar(body)
        .then(user => {
            userPfp.style.backgroundImage = `url(${user.avatar})`;
        })
        .finally(() => {
            pfpFormButton.textContent = "Сохранить";
            closeModal(profilePicPopup);
        });
}

userPfp.addEventListener('click', event => {
    event.preventDefault();
    pfpLinkInput.value = userPfp.style.backgroundImage.slice(5, -2);
    openModal(profilePicPopup);

})

profilePicPopup.addEventListener('submit', handleProfilePictureFormSubmit);

profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');

const validationSettings = {
    formClass: '.popup__form',
    inputClass: '.popup__input',
    inputErrorClass: 'popup__input_error',
    buttonClass: '.popup__button',
    buttonInactiveClass: 'popup__button_inactive',
    errorClass: 'popup__error-text_active'
};
enableValidation(validationSettings);