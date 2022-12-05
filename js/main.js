import { createPosts } from './data.js';
import { renderPicture } from './render.js';
import { openBigPicture } from './view-window.js';
import './image-upload.js';

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
    openBigPicture(post);
  });
};

for (const post of posts) {
  addCheckHandler(post);
}
