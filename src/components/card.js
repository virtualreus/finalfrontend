// Создание карточки
const cardTemplate = document.querySelector('#card-template').content;

function createCard(name, link, likeCount, id) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

    cardElement.querySelector('.card__title').textContent = name;

    const title = cardElement.querySelector('.card__title');
    const image = cardElement.querySelector('.card__image');
    const count = cardElement.querySelector('.card__like-count');
    
    cardElement.id = id;

    title.textContent = name;

    image.setAttribute('src', link);
    image.setAttribute('alt', name);

    count.textContent = likeCount;

    return cardElement;
}

function updateLikeCount(card, likeCount) {
    const count = card.querySelector('.card__like-count');
    count.textContent = likeCount;
    return card;
}

export { createCard, updateLikeCount };