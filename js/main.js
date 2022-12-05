import {createPosts} from './data.js';
import {renderPicture} from './render.js';
import {openWindow, bigPicture} from './view-window.js';

const posts = createPosts();

for (const post of posts) {
  renderPicture(post);
}

const pictures = document.querySelector('.pictures');

const addCheckHandler = (post) => {
  const srcImage = `img[src="${post.url}"]`;
  const picture = pictures.querySelector(srcImage).parentNode;
  picture.addEventListener('click', (evt) => {
    evt.preventDefault();
    document.body.classList.add('modal-open');
    openWindow(post);
  });
};

for (const post of posts) {
  addCheckHandler(post);
}

const closeButton = bigPicture.querySelector('.big-picture__cancel');

closeButton.addEventListener('click', () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
});
