import { isEscapeKey } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const loadMoreButton = bigPicture.querySelector('.social__comments-loader');
const commentCounter = bigPicture.querySelector('.social__comment-count');
const windowComments = bigPicture.querySelector('.social__comments');

// Counter for loaded comments
let counter = 0;

// Array of post.comments
let comments;

// Removing of listener after close bigPicture
const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onBigPictureEscKeydown);
  closeButton.removeEventListener('click', closeBigPicture);
  loadMoreButton.removeEventListener('click', onLoadMoreButton);
};

function onBigPictureEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

// Construction of comment under post
const constructComment = (comment) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.classList.add('social__text');
  p.textContent = comment.message;

  li.appendChild(img);
  li.appendChild(p);

  return li;
};

// Load of new 5 comments
function onLoadMoreButton() {
  for (let i = counter; i < counter + 5; i++) {
    const stringNumberComments = ` из ${comments.length} комментариев`;
    if (i === comments.length - 1) {
      loadMoreButton.classList.add('hidden');
    }
    if (i >= comments.length) {
      break;
    }
    const li = constructComment(comments[i]);
    windowComments.appendChild(li);
    commentCounter.textContent = `${i+1}${stringNumberComments}`;
  }
  counter += 5;
}

// Rendering of bigPicture
const openBigPicture = (post) => {
  bigPicture.classList.remove('hidden');

  // Disable scrolling for the main window
  document.body.classList.add('modal-open');

  closeButton.addEventListener('click', closeBigPicture);
  document.addEventListener('keydown', onBigPictureEscKeydown);

  // Post properties
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = post.url;
  bigPicture.querySelector('.likes-count').textContent = post.likes;
  bigPicture.querySelector('.social__caption').textContent = post.description;

  comments = post.comments;

  // Removing comments from the last post
  const commentBlock = bigPicture.querySelectorAll('.social__comment');
  for (const comment of commentBlock) {
    comment.remove();
  }

  // loadMoreButton Visibility Conditions
  if (comments.length <= 5) {
    loadMoreButton.classList.add('hidden');
  } else {
    loadMoreButton.classList.remove('hidden');
    loadMoreButton.addEventListener('click', onLoadMoreButton);
  }

  // Initial 5 or less comments under post
  let numberComments;
  const stringNumberComments = ` из ${comments.length} комментариев`;
  if (comments.length < 6) {
    numberComments = comments.length;
    commentCounter.textContent = `${comments.length}${stringNumberComments}`;
  } else {
    numberComments = 5;
    commentCounter.textContent = `${5}${stringNumberComments}`;
  }
  for (let i = 0; i < numberComments; i++) {
    const li = constructComment(comments[i]);
    windowComments.appendChild(li);
    counter = i + 1;
  }
};

export { openBigPicture };
