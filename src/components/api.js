const BASE_URL = "https://nomoreparties.co/v1/frontend-st-cohort-201";

const ENDPOINTS = {
  USER: `${BASE_URL}/users/me`,
  CARDS: `${BASE_URL}/cards`,
};

const HTTP_HEADERS = {
  Authorization: "12647faf-f572-4d3b-934f-36957b2ab431",
  "Content-Type": "application/json",
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`HTTP Error: ${response.status} - ${errorDetails}`);
  }
  return response.json();
};

const logError = (error) => console.error("API Error:", error);

const fetchUserData = () => {
  return fetch(ENDPOINTS.USER, { headers: HTTP_HEADERS })
    .then(handleResponse)
    .catch(logError);
};

const fetchCards = () => {
  return fetch(ENDPOINTS.CARDS, { headers: HTTP_HEADERS })
    .then(handleResponse)
    .catch(logError);
};

const updateProfile = (profileData) => {
  return fetch(ENDPOINTS.USER, {
    method: "PATCH",
    headers: HTTP_HEADERS,
    body: JSON.stringify(profileData),
  })
    .then(handleResponse)
    .catch(logError);
};

const addCard = (cardData) => {
  return fetch(ENDPOINTS.CARDS, {
    method: "POST",
    headers: HTTP_HEADERS,
    body: JSON.stringify(cardData),
  })
    .then(handleResponse)
    .catch(logError);
};

const deleteCard = (cardId) => {
  const url = `${ENDPOINTS.CARDS}/${cardId}`;
  return fetch(url, {
    method: "DELETE",
    headers: HTTP_HEADERS,
  })
    .then(handleResponse)
    .catch(logError);
};

const toggleLikeCard = (cardId, action) => {
  const url = `${ENDPOINTS.CARDS}/likes/${cardId}`;
  const validActions = ["PUT", "DELETE"];

  if (!validActions.includes(action)) {
    console.warn(`[toggleLikeCard]: Invalid method (${action})`);
    return Promise.reject(new Error(`Invalid HTTP method: ${action}`));
  }

  return fetch(url, {
    method: action,
    headers: HTTP_HEADERS,
  })
    .then(handleResponse)
    .catch(logError);
};

const updateAvatar = (avatarData) => {
  const url = `${ENDPOINTS.USER}/avatar`;
  return fetch(url, {
    method: "PATCH",
    headers: HTTP_HEADERS,
    body: JSON.stringify(avatarData),
  })
    .then(handleResponse)
    .catch(logError);
};

export {
  fetchUserData,
  fetchCards,
  updateProfile,
  addCard,
  deleteCard,
  toggleLikeCard,
  updateAvatar,
};
