import { isEscapeKey } from './util.js';

//// Selectors for editor view
const inputImage = document.querySelector('#upload-file');
const overlayImage = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');

// Scale
const buttonScaleSmaller = overlayImage.querySelector('.scale__control--smaller');
const buttonScaleBigger = overlayImage.querySelector('.scale__control--bigger');
const scaleControl = overlayImage.querySelector('.scale__control--value');
const editedPicture = overlayImage.querySelector('.img-upload__preview');

// Effects
const effects = overlayImage.querySelector('.effects__list');
const slider = overlayImage.querySelector('.effect-level__slider');
const effectLevelInput = overlayImage.querySelector('.effect-level__value');
const fieldSlider = overlayImage.querySelector('.img-upload__effect-level');
let checkedBox;

//// Selectors for hashtags and comment (description) -> Validation
const form = document.querySelector('.img-upload__form');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');


//// Editor view

const closeOverlayImage = () => {
  inputImage.value = '';
  overlayImage.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onOverlayEscKeydown);
  closeButton.removeEventListener('click', closeOverlayImage);

  // TODO: `remove text error when upload form appears second time
  hashtagInput.value = '';
  commentInput.value = '';
  submitButton.removeAttribute('disabled', 'true');
  form.removeEventListener('submit', submitListener);

  buttonScaleBigger.removeEventListener('click', changeScale);
  buttonScaleSmaller.removeEventListener('click', changeScale);

  effects.removeEventListener('change', effectPicture);
  slider.noUiSlider.destroy();
};

function onOverlayEscKeydown(evt) {
  if (isEscapeKey(evt) && evt.target !== hashtagInput && evt.target !== commentInput) {
    evt.preventDefault();
    closeOverlayImage();
  }
}

function changeScale(evt) {
  const scaleValue = scaleControl.value.replace('%', '');
  if (evt.target === buttonScaleSmaller && scaleValue > 0) {
    scaleControl.value = `${parseInt(scaleValue, 10) - 25}%`;
    editedPicture.style.transform = `scale(${(parseInt(scaleValue, 10) - 25) / 100})`;
  } else if (evt.target === buttonScaleBigger && scaleValue < 100) {
    scaleControl.value = `${parseInt(scaleValue.replace(), 10) + 25}%`;
    editedPicture.style.transform = `scale(${(parseInt(scaleValue, 10) + 25) / 100})`;
  }
}

// Effect change
function effectPicture(evt) {
  checkedBox = evt.target.id;
  let currentMin = 0;
  let currentMax = 100;
  let currentStart = 100;
  let currentStep = 1;
  switch (evt.target.id) {
    case 'effect-chrome':
      currentMin = 0;
      currentMax = 1;
      currentStep = 0.1;
      currentStart = 1;
      break;
    case 'effect-sepia':
      currentMin = 0;
      currentMax = 1;
      currentStep = 0.1;
      currentStart = 1;
      break;
    case 'effect-marvin':
      currentMin = 0;
      currentMax = 100;
      currentStep = 1;
      currentStart = 100;
      break;
    case 'effect-phobos':
      currentMin = 0;
      currentMax = 3;
      currentStep = 0.1;
      currentStart = 3;
      break;
    case 'effect-heat':
      currentMin = 1;
      currentMax = 3;
      currentStep = 0.1;
      currentStart = 3;
      break;
  }
  slider.noUiSlider.updateOptions({
    range: {
      min: currentMin,
      max: currentMax
    },
    start: currentStart,
    step: currentStep
  });
  if (evt.target.id !== 'effect-none') {
    fieldSlider.classList.remove('hidden');
  } else {
    fieldSlider.classList.add('hidden');
  }
  // TODO: `why do we need this?
  editedPicture.className = 'img-upload__preview';
  const effectPreview = evt.target.parentNode.querySelector('.effects__preview');
  editedPicture.classList.add(effectPreview.getAttribute('class').split('  ')[1]);
  // If we use css styles, then maybe adding classes is not necessary?
}

// Effect intensity
const effectIntens = () => {
  const sliderValue = slider.noUiSlider.get();
  effectLevelInput.value = sliderValue;
  let filter;
  switch (checkedBox) {
    case 'effect-chrome':
      filter = `grayscale(${sliderValue})`;
      break;
    case 'effect-sepia':
      filter = `sepia(${sliderValue})`;
      break;
    case 'effect-marvin':
      filter = `invert(${sliderValue}%)`;
      break;
    case 'effect-phobos':
      filter = `blur(${sliderValue}px)`;
      break;
    case 'effect-heat':
      filter = `brightness(${sliderValue})`;
      break;
  }
  if (checkedBox === 'effect-none') {
    editedPicture.style.filter = '';
  } else {
    editedPicture.style.filter = filter;
  }
};

inputImage.addEventListener('change', (evt) => {
  document.addEventListener('keydown', onOverlayEscKeydown);

  closeButton.addEventListener('click', closeOverlayImage);

  scaleControl.value = `${100}%`;
  editedPicture.style.transform = `scale(${1})`;
  buttonScaleSmaller.addEventListener('click', changeScale);
  buttonScaleBigger.addEventListener('click', changeScale);

  editedPicture.classList.add('effects__preview--none');
  effects.addEventListener('change', effectPicture);

  checkedBox = 'effect-none';
  editedPicture.className = 'img-upload__preview';
  fieldSlider.classList.add('hidden');
  noUiSlider.create(slider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100
  });
  slider.noUiSlider.on('update', () => {
    effectIntens();
  });

  evt.preventDefault();
  form.addEventListener('submit', submitListener);
  document.body.classList.add('modal-open');
  overlayImage.classList.remove('hidden');
});


//// Validation of hashtags and comment

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
    submitButton.setAttribute('disabled', 'true');
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
  'Хэштег задан неправильно'
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Комментарий не должен превышать 140 символов'
);

function submitListener(evt) {
  evt.preventDefault();
  pristine.validate();
}
