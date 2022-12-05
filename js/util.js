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

checkStringLength('String', 6);

export {getRandomNumber, getRandomArrayElement};
