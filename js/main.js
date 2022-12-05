
// Does range include number 'to'?
function getRandomNumber(from, to) {
  if (from < 0 || to < 0) {
    //console.log('Диапазон не может быть отрицательным.');
    return;
  }
  const randomNumber = Math.floor(Math.random() * (Math.abs(to - from) + 1)) + from;
  return randomNumber;
}

function checkMaxLength(checkingString, maxLength) {
  return checkingString.length <= maxLength;
}

getRandomNumber();
checkMaxLength();
