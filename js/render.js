
const pictureTemplate = document.querySelector('#picture').content;
const picture = pictureTemplate.querySelector('.picture');
const windowPictures = document.querySelector('.pictures');

const renderPicture = (post) => {
  const pictureClone = picture.cloneNode(true);
  pictureClone.querySelector('.picture__img').src = post.url;
  pictureClone.querySelector('.picture__likes').textContent = post.likes;
  pictureClone.querySelector('.picture__comments').textContent = post.comments.length;
  windowPictures.appendChild(pictureClone);
};


export { renderPicture };
