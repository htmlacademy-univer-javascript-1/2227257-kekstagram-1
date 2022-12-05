import { rendering } from './render.js';
import { getData } from './api.js';
import { showAlert } from './util.js';
import './image-upload.js';

getData((posts) => {
  rendering(posts);}, () => {
  showAlert('Не удалось загрузить данные. Попробуйте перезагрузить страницу', 0);
});
