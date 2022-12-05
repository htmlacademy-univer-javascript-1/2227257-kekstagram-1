import { renderPicture } from './render.js';
import { getData } from './api.js';
import { showAlert } from './util.js';
import './image-upload.js';

getData((posts) => {
  for (const post of posts) {
    renderPicture(post);
  }}, () => {
  showAlert('Не удалось загрузить данные. Попробуйте перезагрузить страницу', 0);
});
