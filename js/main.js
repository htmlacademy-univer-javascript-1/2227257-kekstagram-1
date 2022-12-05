
const DESCRIPTIONS = [
  'Cool',
  'Nice',
  'Beautiful',
  'My favourite photo!',
  'I like this very much',
  'This is what I took today',
  'Not bad',
  'I hate this photo',
  'What do you think about this?',
  'Do you want to say something about this day?',
  'Random photo from gallery'
];

const NAMES = [
  'Artem',
  'Johny',
  'Maria',
  'Anastasia',
  'Julia',
  'Michael',
  'Franklin',
  'Trevor',
  'Naruto',
  'Sasuke',
  'Elizaveta',
  'Violet',
  'Asuna',
  'Elena',
  'Alexander',
  'George',
];

const MESSAGES = [
  'Everything is great!',
  'I am the first!',
  'My grandmother takes better pictures.'
];

const NUMBER_POSTS = 25;
const arrayIdNames = Array(40 * NAMES.length).fill(false);
const arrayId = Array(NUMBER_POSTS).fill(false);
const arrayUrl = Array(NUMBER_POSTS).fill(false);

const getRandomNumber = function (from, to) {
  if (from < 0 || to < 0) {
    throw new Error('Number cannot be negative');
  }
  const newFrom = Math.ceil(Math.min(Math.abs(from), Math.abs(to)));
  const newTo = Math.floor(Math.max(Math.abs(from), Math.abs(to)));
  const randomNumber = Math.floor(Math.random() * (newTo - newFrom + 1) + newFrom);
  return randomNumber;
};

const checkStringLength = (checkingString, maxLength) => checkingString.length <= maxLength;

getRandomNumber(20, 10.5);
checkStringLength('string', 6);

const getRandomArrayElement = function(elements) {
  return elements[getRandomNumber(0, elements.length - 1)];
};

const getRandomId = function (array) {
  for (let i = 0; i < array.length; i++) {
    if (!array[i]) {
      array[i] = true;
      return i + 1;
    }
  }
};

const createComment = function() {
  return {
    id: getRandomId(arrayIdNames),
    avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
    message: getRandomArrayElement(MESSAGES),
    name: getRandomArrayElement(NAMES)
  };
};

const setComments = function() {
  const number = getRandomNumber(1, 3);
  const array = Array(number);
  for (let i = 0; i < number; i++) {
    array[i] = createComment();
  }
  return array;
};

const createPost = function() {
  return {
    id: getRandomId(arrayId),
    url: `photos/${getRandomId(arrayUrl, 1, 25)}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomNumber(15, 200),
    comments: setComments()
  };
};

const arrayOfPosts = Array.from({ length: NUMBER_POSTS }, createPost);

const testFun = function() {
  return 1;
};

testFun(arrayOfPosts);


