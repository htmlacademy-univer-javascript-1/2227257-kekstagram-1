import { openBigPicture } from './view-window.js';

const pictureTemplate = document.querySelector('#picture').content;
const picture = pictureTemplate.querySelector('.picture');
const windowPictures = document.querySelector('.pictures');
const buttonDefault = document.querySelector('[id=filter-default]');
const buttonRandom = document.querySelector('[id=filter-random]');
const buttonDiscussed = document.querySelector('[id=filter-discussed]');
const lastPosts = new Set();

const RERENDER_DELAY = 500;

const renderPicture = (post) => {
  const pictureClone = picture.cloneNode(true);
  pictureClone.querySelector('.picture__img').src = post.url;
  pictureClone.querySelector('.picture__likes').textContent = post.likes;
  pictureClone.querySelector('.picture__comments').textContent = post.comments.length;
  windowPictures.appendChild(pictureClone);
  lastPosts.add(pictureClone);
  pictureClone.addEventListener('click', (evt) => {
    evt.preventDefault();
    pictureClone.blur();
    openBigPicture(post);
  });
};

const renderPictures = (posts) => {
  for (const post of lastPosts) {
    if (windowPictures.contains(post)) {
      windowPictures.removeChild(post);
    }
  }
  lastPosts.clear();
  for (const post of posts) {
    renderPicture(post);
  }
};

const rendering = (posts) => {
  renderPictures(posts);
  const allPosts = new Set();
  for (const post of posts) {
    allPosts.add(post);
  }
  const filters = document.querySelector('.img-filters');
  filters.classList.remove('img-filters--inactive');
  const filterButton = document.querySelector('.img-filters__form');
  let currentFilter = 'filter-default';
  let timeoutId;
  filterButton.addEventListener('click', (evt) => {
    let renderingPosts;
    switch (evt.target.id) {
      case 'filter-default':
        renderingPosts = allPosts;
        buttonDefault.classList.add('img-filters__button--active');
        buttonRandom.classList.remove('img-filters__button--active');
        buttonDiscussed.classList.remove('img-filters__button--active');
        break;
      case 'filter-random':
        renderingPosts = posts.sort(() => Math.random() - 0.5);
        renderingPosts.length = 10;
        buttonDefault.classList.remove('img-filters__button--active');
        buttonRandom.classList.add('img-filters__button--active');
        buttonDiscussed.classList.remove('img-filters__button--active');
        break;
      case 'filter-discussed':
        renderingPosts = posts.sort((a, b) => b.comments.length - a.comments.length);
        buttonDefault.classList.remove('img-filters__button--active');
        buttonRandom.classList.remove('img-filters__button--active');
        buttonDiscussed.classList.add('img-filters__button--active');
        break;
      default:
        currentFilter = evt.target.id;
        break;
    }
    if (evt.target.id !== currentFilter) {
      currentFilter = evt.target.id;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => renderPictures(renderingPosts), RERENDER_DELAY);
    }
  });
};

export { rendering };
