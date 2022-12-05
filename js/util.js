const getRandomNumber = (from, to) => {
  if (from < 0 || to < 0) {
    throw new Error('Number cannot be negative');
  }
  const newFrom = Math.ceil(Math.min(Math.abs(from), Math.abs(to)));
  const newTo = Math.floor(Math.max(Math.abs(from), Math.abs(to)));
  const randomNumber = Math.floor(Math.random() * (newTo - newFrom + 1) + newFrom);
  return randomNumber;
};

const checkStringLength = (checkingString, maxLength) => checkingString.length <= maxLength;

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const showAlert = (message, alertTime) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  if (alertTime !== 0) {
    setTimeout(() => {
      alertContainer.remove();
    }, alertTime);
  }
};

checkStringLength('String', 6);

export { getRandomNumber, getRandomArrayElement, isEscapeKey, showAlert };
