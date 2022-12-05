import { isEscapeKey } from './util.js';

// Selectors for editor view
const inputImage = document.querySelector('#upload-file');
const overlayImage = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');

// Selectors for hashtags and comment (description) -> Validation
const form = document.querySelector('.img-upload__form');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');


// Editor view
const closeOverlayImage = () => {
  inputImage.value = '';
  overlayImage.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onOverlayEscKeydown);
};

inputImage.addEventListener('change', (evt) => {
  document.addEventListener('keydown', onOverlayEscKeydown);

  closeButton.addEventListener('click', closeOverlayImage);

  evt.preventDefault();
  document.body.classList.add('modal-open');
  overlayImage.classList.remove('hidden');
});

function onOverlayEscKeydown(evt) {
  if (isEscapeKey(evt) && evt.target !== hashtagInput && evt.target !== commentInput) {
    evt.preventDefault();
    closeOverlayImage();
  }
}


// Validation of hashtags and comment
let boolHashtagGlobal = true;
let boolCommentGlobal = true;

const pristine = new Pristine(form, {
  classTo: 'text',
  errorClass: 'text--invalid',
  successClass: 'text-valid',
  errorTextParent: 'text',
  errorTextTag: 'div',
  errorTextClass: 'text__error'
}, true);


// If one of them doesn't match, submission (button) is disabled
const controlSubmit = () => {
  if (!boolHashtagGlobal || !boolCommentGlobal) {
    submitButton.setAttribute('disabled', 'false');
  } else {
    submitButton.removeAttribute('disabled', 'true');
  }
};

const regHashtag = /(^\s*$)|(^#[A-Za-zА-Яа-яЁё0-9]{1,19}$)/;

const isCorrectHashtag = (value) => regHashtag.test(value);

const validateHashtag = (value) => {
  const hashtags = value.split(' ');
  const bool = hashtags.every(isCorrectHashtag);
  boolHashtagGlobal = bool;
  controlSubmit();
  return bool;
};

const isCorrectComment = (value) => value.length < 140;

const validateComment = (value) => {
  const bool = isCorrectComment(value);
  boolCommentGlobal = bool;
  controlSubmit();
  return bool;
};

pristine.addValidator(
  hashtagInput,
  validateHashtag,
  'Хэштэг задан неправильно'
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Комментарий не должен превышать 140 символов'
);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});
