import { getRandomNumber, getRandomArrayElement } from './util.js';

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

const getFreeId = (array) => {
  for (let i = 0; i < array.length; i++) {
    if (!array[i]) {
      array[i] = true;
      return i + 1;
    }
  }
};

const createComment = () => ({
  id: getFreeId(arrayIdNames),
  avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const createComments = () => {
  const numberComments = getRandomNumber(1, 3);
  const comments = Array(numberComments);
  for (let i = 0; i < numberComments; i++) {
    comments[i] = createComment();
  }
  return comments;
};

const createPost = () => ({
  id: getFreeId(arrayId),
  url: `photos/${getFreeId(arrayUrl, 1, 25)}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomNumber(15, 200),
  comments: createComments()
});

const createPosts = () => Array.from({ length: NUMBER_POSTS }, createPost);

export {createPosts};
